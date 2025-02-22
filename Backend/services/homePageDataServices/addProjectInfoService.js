const pool = require('../../database/db');
const logger = require('../../configs/logger');
const { v4: uuidv4 } = require('uuid');

exports.addProjectInfoService = async (title, content) => {
    const connection = await pool.getConnection();

    try {
        const id = uuidv4();
        const [addProjectInfo] = await connection.query('INSERT INTO shortProjectInfo (id, infoTitle, infoContent) VALUES (?,?,?)', [id, title, content]);

        if (addProjectInfo.affectedRows === 0) {
            return { status: 'error', message: 'Nie udało się dodać informacji.' };
        }
        return { status: 'success', message: `Informacja o tytule ${title} dodana.` };
    } catch (error) {
        logger.error(`Błąd w addShortProjectInfoService: ${error}`);
        return { status: 'error', message: 'Błąd przetwarzania żądania.' };
    };
};
