import pool from '../../../database/db.js';
import logger from '../../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../../utils/errors/AppError.js';

export const addTechnologyContent = async (name, icon) => {
    const connection = await pool.getConnection();

    try {
        const id = uuidv4();

        const addTechnology = connection.query('INSERT INTO technologies (id, name, icon) VALUES (?,?,?)', [id, name, icon]);

        if (addTechnology.affectedRows === 0) {
            throw new AppError({ code: 'SHELL_HP_1', messageKey: 'Failed to adding new technology.', httpStatus: 500 });
        };
        return { httpStatus: 201, messageKey: `Technology ${name} added correctly.` };
    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error(`addTechnologyContent error: ${error}`);
        throw new AppError({ code: 'SHELL_HP_2', messageKey: 'Internal server error.', httpStatus: 500 });
    }
};
