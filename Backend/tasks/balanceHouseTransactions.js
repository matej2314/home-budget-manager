const cron = require('node-cron');
const pool = require('../database/db');
const logger = require('../configs/logger');

const balanceHouseActions = () => {
    cron.schedule('0 18 * * *', async () => { 
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            logger.info('Bilansowanie rozpoczęte.');

            const [households] = await connection.query(
                `SELECT houseId, userId, userName, houseName, initBudget, balance, DATE(balanceDate) AS balanceDate, DATE(createdAt) AS createdAt 
                 FROM households`
            );

            logger.info(`Znaleziono ${households.length} gospodarstw w bazie.`);

            if (households.length === 0) {
                return;
            }

            const today = new Date().toISOString().split('T')[0];

            for (const household of households) {
                const { houseId, balanceDate, createdAt, balance } = household;

                
                const dateLimit = balanceDate || createdAt;
                logger.info(`Obliczanie daty dla gospodarstwa ${houseId}, balanceDate: ${balanceDate}, createdAt: ${createdAt}`);

                const nextBalanceDate = new Date(dateLimit);
                nextBalanceDate.setDate(nextBalanceDate.getDate() + 1);
                const nextBalanceDateStr = nextBalanceDate.toISOString().split('T')[0];

                if (today >= nextBalanceDateStr) {
                    logger.info(`Sprawdzamy transakcje dla gospodarstwa ${houseId} od ${dateLimit}.`);

                    const [transactions] = await connection.query(
                        `SELECT * FROM transactions WHERE houseId = ? AND DATE(addedAt) >= ?`,
                        [houseId, dateLimit]
                    );

                    logger.info(`Znaleziono ${transactions.length} transakcji dla gospodarstwa ${houseId}.`);

                    if (transactions.length === 0) {
                        logger.info(`Brak transakcji dla gospodarstwa ${houseId} w tym momencie.`);
                    } else {
                        let newBalance = balance || 0;

                        transactions.forEach(ts => {
                            newBalance += ts.type === 'income' ? ts.value : -ts.value;
                        });

                        await connection.query(
                            `UPDATE households SET balance = ?, balanceDate = NOW() WHERE houseId = ?`,
                            [newBalance, houseId]
                        );

                        await connection.query(
                            `DELETE FROM transactions WHERE houseId = ? AND DATE(addedAt) > ?`,
                            [houseId, dateLimit]
                        );

                        logger.info(`Bilans gospodarstwa ${houseId} zaktualizowany.`);
                    }
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
