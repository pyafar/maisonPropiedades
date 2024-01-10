const multer = require('multer');

const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, './public/img/propiedades');
    },
    filename : (req, file, cb)=> {
        cb(null, Date.now() + '-' + file.originalname);
        },
});

const upload = multer({
    storage : storage
});

const multipleUpload = upload.array('images',30);

module.exports = multipleUpload;