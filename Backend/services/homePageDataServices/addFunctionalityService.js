const pool = require('../../database/db');
const logger = require('../../configs/logger');

exports.addFunctionalityContent = async (title, content) => {
    const connection = await pool.getConnection();

    try {
        const id = uuidv4();

        const addFunctionality = connection.query('INSERT INTO functionalities (id, functiontitle, functionContent) VALUES (?,?,?)', [id, title, content]);

        if (addFunctionality.affectedRows === 0) {
            return { status: 'error', message: 'Failed to adding new functionality.' };
        };
        return { status: 'success', message: `Functionality ${title} added correctly.` };
    } catch (error) {
        logger.error(`addFunctionality error: ${error}`);
        return { status: 'error', message: 'Internal server error.' };
    }
};