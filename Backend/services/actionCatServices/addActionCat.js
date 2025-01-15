const pool = require('../../database/db');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../configs/logger');
const actionCatQueries = require('../../database/transactionCategoriesQueries');

const addActionCat = async (name, type) => {
    const id = uuidv4();
    const connection = await pool.getConnection();
    
    try {
        if (!name || !name.trim() || !type || !type.trim()) {
            logger.error(`Brak danych do dodania kategorii transakcji.`);
            return {
                status: 'badreq',
                message: 'Brak wymaganych danych.',
            };
        }
    
        const addCat = await connection.query(actionCatQueries.addQuery, [id, name, type]);
    
        if (addCat.affectedRows == 0) {
            logger.error(`Nie udało się dodać kategorii transakcji ${name}`);
            return { status: 'badreq', message: 'Nie udało się dodać nowej kategorii transakcji.' };
        };
    
        return {
            status: 'success',
            message: `Kategoria transakcji ${name} dodana poprawnie.`,
            catId: id,
        };

    } catch (error) {
        logger.error(`Błąd w actioncat/new: ${error}`);
        return {
            status: 'error',
            message: 'Błąd dodawania nowej kategorii transakcji',
        };

    } finally {
        if (connection) connection.release();
    };
};

module.exports = { addActionCat };