const express = require('express')
const { sequelize, User } = require('./models')
const app = express();

//Multer
const multer = require('multer');

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'avatars')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage })

// ROUTES
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');

});

app.post('/users', upload.single('myImage'), async (req, res) => {
    const { filename, mimetype, size } = req.file;
    const filepath = req.file.path;

    console.log(filename , mimetype , filepath);
    res.send("OK");
})


const main = async () => {

    //desctructive 
    // await sequelize.sync({force:true})

    await sequelize.sync();
}

// main();



app.listen(3000, () => {
    console.log('Server started on port 3000')
});

