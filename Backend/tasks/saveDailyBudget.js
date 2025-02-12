const cron = require('node-cron');
const logger = require('../configs/logger');
const pool = require('../database/db');
const { v4: uuidv4 } = require('uuid');

const saveDailyBudget = async () => {
    cron.schedule('50 23 * * *', async () => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [households] = await connection.query('SELECT houseId, currentBalance FROM households');

            logger.info(`Znaleziono ${households.length} gospodarstw.`);

            if (households.length === 0) {
                return;
            };

            for (const house of households) {
                const id = uuidv4();
                const balanceToDb = house.currentBalance;
                
                const [addDailyBudget] = await connection.query('INSERT INTO dailyBudget (id, houseId, value) VALUES (?, ?, ?);',
                    [id, house.houseId,balanceToDb]);
                if (addDailyBudget.affectedRows === 0) {
                    logger.error('Nie udało się zapisać dziennego budżetu.');
                } else {
                    logger.info('Dzienny budżet wszystkich gospodarstw został zapisany.');
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