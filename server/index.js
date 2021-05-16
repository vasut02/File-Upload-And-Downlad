const express = require('express')
const { sequelize, User, avatar } = require('./models')
const app = express();

const cors = require("cors");
app.use(cors())

app.use(express.json()); // parse JSON Object

const path = require('path')
//Multer
const multer = require('multer');

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'avatars')
    },
    filename: function (req, file, cb) {
        // cb(null, file.fieldname + '-' + file.originalname + '-' + Date.now())
        cb(null, file.fieldname + '-' + file.originalname.split('.')[0] + '-' + Date.now())
        // cb(null, `${new Date().getTime()}_${file.originalname}`);
    }
})

/* 
*   for storing at differnet destination

*    destination: (req, file, callback) => {
*    let type = req.params.type;
*    let path = `./uploads/${type}`;
*    fs.mkdirsSync(path);
*    callback(null, path);
*    },
* */

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 // max file size 10MB = 1000000 bytes
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
            return cb(
                new Error(
                    'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
                )
            );
        }
        cb(undefined, true); // continue with upload
    }
});

const save_file = async (data) => {

    //return rne promise for saving file
    return new Promise(async (resolve, reject) => {

        // perofrm necessary function
        const { filename, filepath, mimetype, size, userId } = data
        try {
            const avatr = await avatar.create({ filename, filepath, mimetype, size, userId })
            resolve(avatr);
        } catch (err) {
            console.log('/save firl', err);
            reject({
                success: false,
                message: 'upload failed',
                stack: err.stack,
            })
        }
    })
}

app.post('/upload', upload.single('File'), async (req, res) => {
    
    //get file data and then user from form data 
    const { filename, mimetype, size } = req.file;
    const filepath = req.file.path;

    const { firstName, lastName, email } = req.body

    try {

        // try creating usere first
        const user = await User.create({ firstName, lastName, email })

        if (user) {
            const data = { filename, filepath, mimetype, size, userId: user.id }
            save_file(data).then((result) => {
                console.log('file uploaded successfully.', result.dataValues);
                return res.send('file uploaded successfully.');
            }).catch((error) => {
                console.log('/upload', error);
                res.status(400).send('Error while uploading file. Try again later.');
            })
        }

    } catch (error) {
        console.log('/upload', error);
        res.status(400).send('Error while uploading file. Try again later.');
    }
},
    (error, req, res, next) => {
        if (error) {
            console.log('/upload', error);
            res.status(500).send(error.message);
        }
    }
);

app.get('/getAllFiles', async (req, res) => {
    try {
      const files = await User.findAll({include: 'avatar' , order: [['createdAt', 'DESC']]});
      res.send(files);
    } catch (error) {
      res.status(400).send('Error while getting list of files. Try again later.');
    }
  });

app.get('/download/:id', (req, res) => {
    const { id } = req.params;

    User.findOne({ where: { id }, include: 'avatar' }).then((user) => {
        // console.log(user);
        if (user && user.avatar) {
            // if user.avatar found then return file with its file path/

            const dirname = path.resolve();
            const fullfilepath = path.join(dirname, user.avatar.filepath);

            // specify file type other it won't work
            return res.type(user.avatar.mimetype)
                .sendFile(fullfilepath);
        }
        return Promise.reject(
            new Error('Image does not exist')
        );
    }).catch((err) => {
        console.log('/user/:id get', err);
        res.status(404)
            .json({
                success: false,
                message: 'not found',
                stack: err.stack,
            })
    })
})

// Image Get Routes
app.get('/image/:id', (req, res) => {

    //get id 
    const { id } = req.params;
    avatar.findOne({ where: { id } }).then((avatar) => {
        if (avatar) {

            // if avatar found then return file with its file path/

            const dirname = path.resolve();
            const fullfilepath = path.join(dirname, avatar.filepath);

            // specify file type other it won't work
            return res.type(avatar.mimetype)
                .sendFile(fullfilepath);
        }

        // creating promise to catch below
        return Promise.reject(
            new Error('Image does not exist')
        );
    }).catch(err => res
        .status(404)
        .json(
            {
                success: false,
                message: 'not found',
                stack: err.stack,
            }
        ),
    );
});

app.listen(8000, async () => {

    console.log('Server started on port 8000')

    // destructive
    // await sequelize.sync({force:true});

    //just get connected to the database
    await sequelize.authenticate;
    console.log('Database Connected!!');

});