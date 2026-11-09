import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';

export const addTechnologyContent = async (name, icon) => {
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
