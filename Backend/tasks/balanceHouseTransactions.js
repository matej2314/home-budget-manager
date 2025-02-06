const cron = require('node-cron');
const pool = require('../database/db');
const logger = require('../configs/logger');
const { v4: uuidv4 } = require('uuid');

const balanceHouseActions = async () => {
    cron.schedule('25 0 * * *', async () => { 
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            logger.info('Bilansowanie rozpoczęte.');

            const [households] = await connection.query(
                `SELECT houseId, initBudget, balanceDate, createdAt FROM households`
            );

            logger.info(`Znaleziono ${households.length} gospodarstw w bazie.`);

            if (households.length === 0) {
                return;
            };

            const today = new Date().toISOString().split('T')[0];

            for (const household of households) {
                const { houseId, balanceDate, createdAt, initBudget } = household;

                const formattedBalanceDate = balanceDate ? new Date(balanceDate).toISOString().split('T')[0] : null;
                const formattedCreatedAt = new Date(createdAt).toISOString().split('T')[0];
                
                const dateLimit = formattedBalanceDate || formattedCreatedAt;

                logger.info(`Obliczanie daty dla gospodarstwa ${houseId}, balanceDate: ${balanceDate}, createdAt: ${createdAt}`);

                const nextBalanceDate = new Date(dateLimit);
                nextBalanceDate.setDate(nextBalanceDate.getDate() + 30);
                const nextBalanceDateStr = nextBalanceDate.toISOString().split('T')[0];
                
                if (today >= nextBalanceDateStr) {
                    logger.info(`Sprawdzamy transakcje dla gospodarstwa ${houseId} od ${dateLimit}.`);

                    const [transactions] = await connection.query(
                        `SELECT * FROM transactions WHERE houseId = ? AND DATE(addedAt) >= ?`,
                        [houseId, dateLimit]
                    );
                    
                    logger.info(`Znaleziono ${transactions.length} transakcji dla gospodarstwa ${houseId}.`);
                    const transactionCountId = uuidv4();

                    await connection.query(`INSERT INTO monthlyTransactionCounts (id, houseId, transactionCount, startDate, balanceDate) VALUES (?,?,?,?,?)`,
                        [transactionCountId, houseId, transactions.length, dateLimit, today]);

                    let newBalance = 0;

                    if (!formattedBalanceDate) {
                        newBalance = initBudget;
                    } else {
                        const [initialBudgetRows] = await connection.query(
                            `SELECT value FROM initialMonthlyBudgets WHERE houseId = ? ORDER BY addedAt DESC LIMIT 1`,
                            [houseId]
                        );

                        if (initialBudgetRows.length > 0) {
                            newBalance = initialBudgetRows[0].value;
                        } else {
                            newBalance = initBudget;
                        }
                    }

                    transactions.forEach(ts => {
                        if (ts.type === 'income') {
                            newBalance += ts.value;
                        } else if (ts.type === 'expense') {
                            newBalance -= ts.value;
                        }
                    });

                    const id = uuidv4();

                    const [insertBalance] = await connection.query(
                        `INSERT INTO monthly_balances (id, monthly_balance, houseId, balanceDate) VALUES(?, ?, ?, NOW());`,
                        [id, parseInt(newBalance), houseId]
                    );

                    if (insertBalance.affectedRows === 1) {
                        await connection.query('UPDATE households SET balanceDate = NOW() WHERE houseId=?', [houseId]);
                    }

                    await connection.query(
                        `DELETE FROM transactions WHERE houseId = ? AND DATE(addedAt) > ?`,
                        [houseId, dateLimit]
                    );

                    logger.info(`Bilans gospodarstwa ${houseId} zaktualizowany.`);
                } else {
                    logger.info(`Gospodarstwo ${houseId} nie wymaga bilansowania przed ${nextBalanceDateStr}.`);
                }
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            logger.error(`Błąd podczas bilansowania gospodarstw: ${error}`);
        } finally {
            if (connection) connection.release();
        }
    });
};

module.exports = balanceHouseActions;