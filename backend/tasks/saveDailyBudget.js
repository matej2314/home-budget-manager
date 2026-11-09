import cron from 'node-cron';
import pool from '../database/db.js';
import logger from '../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';

const saveDailyBudget = async () => {
    cron.schedule('50 23 * * *', async () => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [households] = await connection.query('SELECT houseId, currentBalance FROM households');

            logger.info(`Finded ${households.length} households.`);

            if (households.length === 0) {
                return;
            };

            for (const house of households) {
                const id = uuidv4();
                const balanceToDb = house.currentBalance;

                const [addDailyBudget] = await connection.query('INSERT INTO dailyBudget (id, houseId, value) VALUES (?, ?, ?);',
                    [id, house.houseId, balanceToDb]);
                if (addDailyBudget.affectedRows === 0) {
                    logger.error('Failed to save daily budget.');
                } else {
                    logger.info('The daily budget of all households has been saved.');
                }
            };

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            logger.error(error);
        } finally {
            if (connection) connection.release();
        }

    });
};

export default saveDailyBudget;
