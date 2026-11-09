import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import pool from '../database/db.js';
import logger from '../configs/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const userId = req.userId;
        const mainPath = path.join(__dirname, `../public/user-photos/${userId}`);


        const avatarFileName = `${userId}${path.extname(file.originalname)}`;

        try {
            if (file.fieldname === 'avatar') {

                await pool.query('UPDATE users SET avatarName = ? WHERE id = ?', [avatarFileName, userId]);
                cb(null, mainPath);
            } else {
                cb(new Error('Unsupported file type.'));
            }
        } catch (error) {
            logger.error(`An error occured to fetch avatar of user ${userId}: ${error.message}`);
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const userId = req.userId;

        const avatarFileName = `${userId}${path.extname(file.originalname)}`;
        cb(null, avatarFileName);
    },
});

const saveAvatar = multer({
    storage: avatarStorage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpg|jpeg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb(new Error('Unsupported file type. Supported file types: jpg, jpeg, png.'));
    },
});

export default saveAvatar;
