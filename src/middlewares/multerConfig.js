const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'profile') {
            cb(null, 'uploads/profiles');
        } else if (file.fieldname === 'product') {
            cb(null, 'uploads/products');
        } else if (file.fieldname === 'documents') {
            cb(null, 'uploads/documents');
        } else {
            cb(null, 'uploads/others');
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;