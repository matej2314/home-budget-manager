const cron = require('node-cron');
const logger = require('../configs/logger');
const pool = require('../database/db');
const { v4: uuidv4 } = require('uuid');

const saveDailyTransactions = async () => {
    cron.schedule('0 0 * * *', async () => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [households] = await connection.query('SELECT houseId from households');

            if (households.length === 0) {
                logger.error('Nie znaleziono gospodarstw w bazie danych.');
                return;
            }

            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 1, 0, 0);
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 58, 0, 0);

            const timeInterval = {
                start: startOfDay,
                end: endOfDay,
            };

           
            const getDailyTransactionsQuery = `
                SELECT houseId, COUNT(transactionId) AS transactionCount
                FROM transactions WHERE addedAt BETWEEN ? AND ? AND houseId IN (?)
                GROUP BY houseId;
            `;

            const [rows] = await connection.query(getDailyTransactionsQuery, [timeInterval.start, timeInterval.end, households.map((house) => house.houseId)]);

            if (rows.length === 0) {
                logger.error('Brak nowych transakcji.');
                return;
            }

            for (const row of rows) {
                const id = uuidv4();
                const transactionCount = row.transactionCount;
                const houseId = row.houseId;

                const [addActionCount] = await connection.query('INSERT INTO dailyTransactions(id, dailyActionCount, houseId, date)',
                    [id, transactionCount, houseId, now]
                );

                if (addActionCount.affectedRows === 0) {
                    logger.error(`Nie zapisano dziennych transakcji dla houseId: ${houseId}`)
                } else {
                    logger.info(`Zapisano liczbę dziennych transakcji dla ${houseId}`);
                }
            };

            await connection.commit();
        } catch (error) {
            logger.error(`Błąd w saveDailyTransactions: ${error}`);
            await connection.rollback();
        } finally {
            if (connection) connection.release();
        }
    });
};

module.exports = saveDailyTransactions;