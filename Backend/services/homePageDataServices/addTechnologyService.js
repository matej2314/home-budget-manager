const pool = require('../../database/db');
const logger = require('../../configs/logger');
const { v4: uuidv4 } = require('uuid');

exports.addTechnologyContent = async (name, icon) => {
    const connection = await pool.getConnection();

    try {
        const id = uuidv4();

        const addTechnology = connection.query('INSERT INTO technologies (id, name, icon) VALUES (?,?,?)', [id, name, icon]);

        if (addTechnology.affectedRows === 0) {
            return { status: 'error', message: 'Failed to adding new technology.' };
        };
        return { status: 'success', message: `Technology ${name} added correctly.` };
    } catch (error) {
        logger.error(`addTechnologyContent error: ${error}`);
        return { status: 'error', message: 'Internal server error.' };
    }
};