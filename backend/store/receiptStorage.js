const multer = require('multer');

const storage = multer.memoryStorage();
const uploadReceipt = multer({ storage: storage });

module.exports = { uploadReceipt };
