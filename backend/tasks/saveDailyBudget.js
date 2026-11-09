const cron = require('node-cron');
const pool = require('../database/db');
const logger = require('../configs/logger');
const { v4: uuidv4 } = require('uuid');

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

module.exports = saveDailyBudget;