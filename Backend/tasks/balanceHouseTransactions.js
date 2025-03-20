const cron = require('node-cron');
const pool = require('../database/db');
const logger = require('../configs/logger');
const { handleNotification } = require('../utils/handleNotification');
const { v4: uuidv4 } = require('uuid');

const balanceHouseActions = async () => {
    cron.schedule('58 23 * * *', async () => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            logger.info('Bilansowanie rozpoczęte.');

            const [households] = await connection.query(
                `SELECT houseId, initBudget, monthlyBalanceDate, createdAt FROM households`
            );

            logger.info(`Finded ${households.length} households in database.`);

            if (households.length === 0) {
                return;
            };

            const today = new Date().toISOString().split('T')[0];

            for (const household of households) {
                const { houseId, monthlyBalanceDate, createdAt, initBudget } = household;

                const formattedBalanceDate = monthlyBalanceDate ? new Date(monthlyBalanceDate).toISOString().split('T')[0] : null;
                const formattedCreatedAt = new Date(createdAt).toISOString().split('T')[0];

                const dateLimit = formattedBalanceDate || formattedCreatedAt;

                logger.info(`Calculating the date for household ${houseId}, balanceDate: ${monthlyBalanceDate}, createdAt: ${createdAt}`);

                const nextBalanceDate = new Date(dateLimit);
                nextBalanceDate.setDate(nextBalanceDate.getDate() + 1);
                const nextBalanceDateStr = nextBalanceDate.toISOString().split('T')[0];

                if (today === nextBalanceDateStr) {
                    logger.info(`Check transactions for household ${houseId} from ${dateLimit}.`);

                    const [transactions] = await connection.query(
                        `SELECT value, type FROM transactions WHERE houseId = ? AND DATE(addedAt) BETWEEN ? AND ?`,
                        [houseId, dateLimit, nextBalanceDateStr]
                    );

                    logger.info(`Finded ${transactions.length} transactions for household ${houseId}.`);
                    const transactionCountId = uuidv4();

                    await connection.query(`INSERT INTO monthlyTransactionCounts (id, houseId, transactionCount, startDate, balanceDate) VALUES (?,?,?,?,?)`,
                        [transactionCountId, houseId, transactions.length, dateLimit, today]);

                    let newBalance = 0;

                    if (!formattedBalanceDate) {
                        newBalance = parseFloat(initBudget);
                    } else {
                        const [initialBudgetRows] = await connection.query(
                            `SELECT value FROM initialMonthlyBudgets WHERE houseId = ? ORDER BY addedAt DESC LIMIT 1`,
                            [houseId]
                        );

                        if (initialBudgetRows.length > 0) {
                            newBalance = parseFloat(initialBudgetRows[0].value);
                        } else {
                            newBalance = parseFloat(initBudget)
                        }
                    }

                    transactions.forEach(ts => {
                        if (ts.type === 'income') {
                            newBalance += parseFloat(ts.value);
                        } else if (ts.type === 'expense') {
                            newBalance -= ts.value;
                        }
                    });

                    const id = uuidv4();
                    const newBalanceToDb = parseFloat(newBalance);
                    const [insertBalance] = await connection.query(
                        `INSERT INTO monthly_balances (id, monthly_balance, houseId, monthlyBalanceDate) VALUES(?, ?, ?, NOW());`,
                        [id, newBalanceToDb, houseId]
                    );

                    if (insertBalance.affectedRows === 1) {
                        await connection.query('UPDATE households SET monthlyBalanceDate = NOW() WHERE houseId=?', [houseId]);
                    }

                    const noticeId = uuidv4();

                    await handleNotification({
                        noticeId,
                        category: 'monthlyBalance',
                        houseId,
                        message: 'notifications.neMonthlyBalance',
                    });

                    logger.info(`Balance for household ${houseId} updated.`);
                } else {
                    logger.info(`Household ${houseId} do not require finance balancing before ${nextBalanceDateStr}.`);
                }
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            logger.error(`An error occured during households finance balancing: ${error}`);
        } finally {
            if (connection) connection.release();
        }
    });
};

module.exports = balanceHouseActions;