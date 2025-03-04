const cron = require('node-cron');
const pool = require('../database/db');
const logger = require('../configs/logger');
const { v4: uuidv4 } = require('uuid');

const saveDailyTransactions = async () => {
    cron.schedule('45 23 * * *', async () => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [households] = await connection.query('SELECT houseId from households');

            if (households.length === 0) {
                logger.error('No households found.');
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
                logger.error('No new transactions.');
                return;
            }

            const valuesToInsert = rows.map(row => [
                uuidv4(),
                row.transactionCount,
                row.houseId,
                now,
            ]);

            const addActionQuery = 'INSERT INTO dailyTransactions (id, dailyActionCount, houseId, date) VALUES ?';

            const [addActionCount] = await connection.query(addActionQuery, [valuesToInsert]);

            if (addActionCount.affectedRows === rows.length) {
                logger.info(`Saved ${addActionCount.affectedRows.length} daily transactions.`);
            } else {
                logger.error(`No daily transactions saved.`);
            };

            await connection.commit();
        } catch (error) {
            logger.error(`saveDailyTransactions error: ${error}`);
            await connection.rollback();
        } finally {
            if (connection) connection.release();
        }
    });
};

module.exports = saveDailyTransactions;