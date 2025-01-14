const cron = require('node-cron');
const pool = require('../database/db');
const logger = require('../configs/logger');
const { formatDateToSQL } = require('../utils/formatDateToSQL');

const balanceHouseActions = () => {
    cron.schedule('0 2 * * *', async () => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            logger.info('Bilansowanie rozpoczęte.');

            const [households] = await connection.query('SELECT * FROM households');
            logger.info(`Znaleziono ${households.length} gospodarstw w bazie.`);

            if (households.length === 0) {
                logger.info('Brak gospodarstwa w bazie danych.');
                return;
            }

            for (const household of households) {
                const { houseId, balanceDate, createdAt, balance } = household;

                const dateLimit = balanceDate || createdAt;
                const nextBalanceDate = new Date(dateLimit);
                nextBalanceDate.setMonth(nextBalanceDate.getMonth() + 1);

                const now = new Date();

                if (now >= nextBalanceDate) {
                    const formattedDateLimit = formatDateToSQL(dateLimit);

                    logger.info(`Sprawdzamy transakcje dla gospodarstwa ${houseId} od ${formattedDateLimit}.`);

                    const [transactions] = await connection.query(
                        `SELECT * FROM transactions WHERE houseId = ? AND addedAt > ?`,
                        [houseId, formattedDateLimit]
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
                            `DELETE FROM transactions WHERE houseId = ? AND addedAt > ?`,
                            [houseId, formattedDateLimit]
                        );

                        logger.info(`Bilans gospodarstwa ${houseId} zaktualizowany.`);
                    }
                } else {
                    logger.info(`Gospodarstwo ${houseId} nie wymaga bilansowania przed ${nextBalanceDate.toLocaleString()}.`);
                }
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            logger.error(`Błąd podczas bilansowania gospodarstw: ${error}`);
        } finally {
            connection.release();
        }
    });
};

module.exports = balanceHouseActions;
