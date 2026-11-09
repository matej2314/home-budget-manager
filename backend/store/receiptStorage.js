import multer from 'multer';

const storage = multer.memoryStorage();
const uploadReceipt = multer({ storage: storage });

export { uploadReceipt };
