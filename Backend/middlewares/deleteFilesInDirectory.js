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
        for (const file of files) {
            const filePath = path.join(userPath, file);
            try {
                await fs.unlink(filePath);
                logger.info(`Plik ${filePath} usunięty.`);
            } catch (error) {
                logger.error(`Nie udało się usunąć pliku ${filePath}: ${error.message}`);
            }
        }
        logger.info('Avatary usunięte.');
        next();
    } catch (error) {
        logger.error(`Bląd podczas operacji na plikach: ${error.message}`);
        return res.status(500).json({ status: 'error', message: 'Błąd podczas operacji na plikach.' });
    }
};

module.exports = deleteFiles;