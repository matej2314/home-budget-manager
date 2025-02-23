const fs = require('fs/promises');
const path = require('path');
const logger = require('../configs/logger');
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

const deleteFiles = async (req, res, next) => {
    const userId = req.userId;
    const userPath = path.join(__dirname, `../public/user-photos/${userId}`);

    try {
        await fs.access(userPath);
        logger.info(`Folder użytkownika ${userId} istnieje.`);
    } catch (error) {
        logger.error(`Folder użytkownika ${userId} nie istnieje.`);
        return res.status(statusCode.NOT_FOUND).json({
            status: 'error',
            message: 'Folder użytkownika nie istnieje.'
        });
    }

    try {
        const files = await fs.readdir(userPath);
        if (files.length !== 1) {
            logger.error(`Nie znaleziono avatara użytkownika ${userId}`);
            return res.status(statusCode.NOT_FOUND).json({
                status: 'error',
                message: 'Nie znaleziono avatara użytkownika.'
            });
        };

        const file = files[0];
        const filePath = path.join(userPath, file);
        await fs.unlink(filePath);
        await fs.rmdir(userPath);
        logger.info('Avatary usunięte.');
        next();
    } catch (error) {
        logger.error(`Bląd podczas operacji na plikach: ${error.message}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd podczas operacji na plikach.'
        });
    }
};

module.exports = deleteFiles;