import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';

/** Dzienny agregat liczby transakcji per dom (`dailyTransactions`). Cron → service (B-5). */
export async function saveDailyTransactionsSnapshot() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [households] = await connection.query('SELECT houseId from households');

    if (households.length === 0) {
      logger.error('No households found.');
      await connection.commit();
      return;
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 1, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 58, 0, 0);

    const getDailyTransactionsQuery = `
      SELECT houseId, COUNT(transactionId) AS transactionCount
      FROM transactions WHERE addedAt BETWEEN ? AND ? AND houseId IN (?)
      GROUP BY houseId;
    `;

    const houseIdMap = households.map((house) => house.houseId);

    const [rows] = await connection.query(getDailyTransactionsQuery, [
      startOfDay,
      endOfDay,
      houseIdMap,
    ]);

    if (rows.length === 0) {
      logger.error('No new transactions.');
      await connection.commit();
      return;
    }

    const valuesToInsert = rows.map((row) => [
      uuidv4(),
      row.transactionCount,
      row.houseId,
      now,
    ]);

    const addActionQuery =
      'INSERT INTO dailyTransactions (id, dailyActionCount, houseId, date) VALUES ?';

    const [addActionCount] = await connection.query(addActionQuery, [valuesToInsert]);

    if (addActionCount.affectedRows === rows.length) {
      logger.info(`Saved ${addActionCount.affectedRows} daily transactions.`);
    } else {
      logger.error(`No daily transactions saved.`);
    }

    await connection.commit();
  } catch (error) {
    logger.error(`saveDailyTransactions error: ${error}`);
    await connection.rollback();
  } finally {
    connection.release();
  }
}
