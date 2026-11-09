import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import actionCatQueries from '../../database/transactionCategoriesQueries.js';

const addActionCat = async (name, type) => {
    const id = uuidv4();
    const connection = await pool.getConnection();

    try {
        if (!name || !name.trim() || !type || !type.trim()) {
            logger.error(`No required transaction category details.`);
            return {
                status: 'badreq',
                message: 'Invalid input data.',
            };
        }

        const addCat = await connection.query(actionCatQueries.addQuery, [id, name, type]);

        if (addCat.affectedRows == 0) {
            logger.error(`Failed to add transaction category ${name}`);
            return { status: 'badreq', message: 'Failed to add new transaction category.' };
        };

        return {
            status: 'success',
            message: `Transaction category ${name} added correctly.`,
            catId: id,
        };

    } catch (error) {
        logger.error(`actioncat/new error: ${error}`);
        return {
            status: 'error',
            message: 'Adding new transaction category error.',
        };

    } finally {
        if (connection) connection.release();
    };
};

export { addActionCat };
