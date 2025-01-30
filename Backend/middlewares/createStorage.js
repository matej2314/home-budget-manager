const multer = require('multer');
const path = require('path');
const logger = require('../configs/logger');

const avatarStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const userId = req.userId;
        const mainPath = path.join(__dirname, `../public/user-photos/${userId}`);

        try {
            if (file.fieldname === 'avatar') {
                cb(null, mainPath);
            } else {
                cb(new Error('Nieobsługiwany typ pliku.'));
            };
        } catch (error) {
            logger.error(`Nie udało się zapisać avatara użytkownika ${userId}: ${error.message}`);
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}-${userId}`);
    },
});

const saveAvatar = multer({
    storage: avatarStorage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb(new Error('Nieobsługiwany format pliku.'));
    },
});

module.exports = saveAvatar;