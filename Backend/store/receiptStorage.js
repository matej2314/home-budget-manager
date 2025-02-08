const multer = require('multer');
const path = require('path');
const logger = require('../configs/logger'); 

const receiptStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploadReceipt = multer({ storage: receiptStorage });


module.exports = { uploadReceipt };