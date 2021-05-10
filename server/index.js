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
        cb(null, file.fieldname + '-' + file.originalname + '-' + Date.now())
        // cb(null, Date.now() + '-' + file.originalname )
    }
})

var upload = multer({ storage: storage })

const axios = require('axios');

// post user 
app.post('/users', upload.single('File'), async (req, res) => {

    //get file data and then user from form data 
    const { filename, mimetype, size } = req.file;
    const filepath = req.file.path;

    const { firstName, lastName, email } = req.body
    try {

        // try creating usere first
        const user = await User.create({ firstName, lastName, email })

        //create user and send the file data to be posted in databse 
        if (user) {

            //send required data
            const data = { filename, filepath, mimetype, size, userId: user.id }
            console.log(data);
            axios.post('http://localhost:8000/avatar', data).then((result) => {
                console.log('avatar result', result.json);
                res.json(user);
            }).catch((err) => {
                console.log('/post users ', err);
                return res.status(500).json(err);
            })
        }
    } catch (err) {
        console.log('/post users ', err);
        return res.status(500).json(err);
    }
})

app.post('/avatar', async (req, res) => {
    const { filename, filepath, mimetype, size, userId } = req.body

    console.log('as', req.body);
    try {
        const avatr = await avatar.create({ filename, filepath, mimetype, size, userId })
        return res.json({ avatr });
    } catch (err) {
        console.log('/avatar post ', err);
        res.json({
            success: false,
            message: 'upload failed',
            stack: err.stack,
        })
    }
});

app.get('/user/:id', (req, res) => {
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