const pool = require('../../database/db');
const logger = require('../../configs/logger');

exports.addFunctionalityContent = async (title, content) => {
    const connection = await pool.getConnection();

    try {
        const id = uuidv4();

        const addFunctionality = connection.query('INSERT INTO functionalities (id, functiontitle, functionContent) VALUES (?,?,?)', [id, title, content]);

        if (addFunctionality.affectedRows === 0) {
            return { status: 'error', message: 'Nie udało się dodać funkcjonalności.' };
        };
        return { status: 'success', message: `Dodano funkcjonalność ${title}` };
    } catch (error) {
        logger.error(`Błąd w addFunctionality: ${error}`);
        return { status: 'error', message: 'Błąd przetwarzania żądania.' };
    }
};