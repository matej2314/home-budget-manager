const fs = require('fs/promises');
const path = require('path');
const logger = require('../configs/logger');

const deleteFiles = async (req, res, next) => {
    const userId = req.userId;
    const userPath = path.join(__dirname, `../public/user-photos/${userId}`);

    try {
        await fs.access(userPath);
        logger.info(`Folder użytkownika ${userId} istnieje.`);
    } catch (error) {
        logger.error(`Folder użytkownika ${userId} nie istnieje.`);
        return res.status(404).json({ status: 'error', message: 'Folder użytkownika nie istnieje.' });
    }

    try {
        const files = await fs.readdir(userPath);
        if (files.length !== 1) {
            logger.error(`Nie znaleziono avatara użytkownika ${userId}`);
            return res.status(404).json({ status: 'error', message: 'Nie znaleziono avatara użytkownika.' });
        };

        const file = files[0];
        const filePath = path.join(userPath, file);
        await fs.unlink(filePath);
        await fs.rmdir(userPath);
        logger.info('Avatary usunięte.');
        next();
    } catch (error) {
        logger.error(`Bląd podczas operacji na plikach: ${error.message}`);
        return res.status(500).json({ status: 'error', message: 'Błąd podczas operacji na plikach.' });
    }
};

module.exports = deleteFiles;