const fs = require('fs');
const path = require('path');
const logger = require('../configs/logger');


const createUserDirectory = (req, res, next) => {
    const userId = req.userId;
    const basePath = path.join(__dirname, '../public/user-photos');
    const userDirectory = path.join(basePath, userId);

    try {
        if (!fs.existsSync(userDirectory)) {
            fs.mkdirSync(userDirectory, { recursive: true });
        };

        logger.info(`Katalog na avatar użytkownika ${userId} utworzony.`);
        next();
    } catch (error) {
        logger.error(`Błąd podczas tworzenia katalogu użytkownika: ${userId}`);
        return res.status(500).json({ status: 'error', message: `Nie udało się utworzyć katalogu użytkownika.` });
    }
};

module.exports = createUserDirectory;