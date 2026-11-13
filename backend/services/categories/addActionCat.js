import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import actionCatQueries from '../../database/transactionCategoriesQueries.js';
import { AppError } from '../../utils/errors/AppError.js';

const addActionCat = async (name, type) => {
    const id = uuidv4();
    const connection = await pool.getConnection();

    try {
        if (!name || !name.trim() || !type || !type.trim()) {
            logger.error(`No required transaction category details.`);
            throw new AppError({ code: 'CAT_1', messageKey: 'Invalid input data.', httpStatus: 400 });
        }

        const addCat = await connection.query(actionCatQueries.addQuery, [id, name, type]);

        if (addCat.affectedRows == 0) {
            logger.error(`Failed to add transaction category ${name}`);
            throw new AppError({ code: 'CAT_2', messageKey: 'Failed to add new transaction category.', httpStatus: 400 });
        };

        return {
            messageKey: `Transaction category ${name} added correctly.`,
            catId: id,
        };

    } catch (error) {
        if (error instanceof AppError) throw error;
        logger.error(`actioncat/new error: ${error}`);
        throw new AppError({ code: 'CAT_3', messageKey: 'Adding new transaction category error.', httpStatus: 500 });

    } finally {
        if (connection) connection.release();
    };
};

export { addActionCat };
