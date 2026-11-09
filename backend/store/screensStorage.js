import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import logger from '../configs/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screensStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const filesPath = path.join(__dirname, '../app-images');

        try {
            if (file.fieldname === 'screens') {
                cb(null, filesPath);
            } else {
                cb(new Error('Unsupported file type.'));
            }
        } catch (error) {
            logger.error(`An error occured during save screenshots : ${error}`);
        }
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname;
        cb(null, fileName);
    }
});

const saveScreen = multer({
    storage: screensStorage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpg|png|jpeg/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb(new Error('Unsupported file type. '))
    }
});

export default saveScreen;
