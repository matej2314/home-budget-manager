const cron = require('node-cron');
const logger = require('../configs/logger');
const pool = require('../database/db');
const { v4: uuidv4 } = require('uuid');

const saveDailyTransactions = async () => {
    // cron.schedule('45 23 * * *', async () => {
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

            const houseIdMap = households.map((house) => house.houseId);

            const [rows] = await connection.query(getDailyTransactionsQuery, [timeInterval.start, timeInterval.end, houseIdMap]);

            if (rows.length === 0) {
                logger.error('Brak nowych transakcji.');
                return;
            }

            const valuesToInsert = rows.map(row => [
                uuidv4(),
                row.transactionCount,
                row.houseId,
                now,
            ]);

            const addActionQuery = 'INSERT INTO dailyTransactions (id, dailyActionCount, houseId, date) VALUES ?';

            const [addActionCount] = await connection.query(addActionQuery,[valuesToInsert]);

            if (addActionCount.affectedRows === rows.length) {
                logger.info(`Zapisano ${addActionCount.affectedRows} dziennych transakcji.`);
            } else {
                logger.error(`Nie zapisano dziennych transakcji.`);
            };

            await connection.commit();
        } catch (error) {
            logger.error(`Błąd w saveDailyTransactions: ${error}`);
            await connection.rollback();
        } finally {
            if (connection) connection.release();
        }
    // });
};

module.exports = saveDailyTransactions;