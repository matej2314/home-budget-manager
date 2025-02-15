const pool = require('../database/db');
const logger = require('../configs/logger');
const { v4: uuidv4 } = require('uuid');
const checkUserHouse = require('../utils/checkUserHouse.js');
const initialBudgetQueries = require('../database/initialMonthlyBudgetQueries.js');
const { broadcastToHouseMates } = require('../configs/websocketConfig.js');
const { addNewBudget, clearExtraValues} = require('../utils/initMonthlyBudgetFunctions.js');

exports.addNewMonthlyBudget = async (req, res) => {
    const userId = req.userId;
    const { value } = req.body;
    
    if (!value) {
        return res.status(400).json({ status: 'error', message: 'Podaj budżet!' });
    };

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const checkHouse = await checkUserHouse(connection, userId);
        if (!checkHouse) {
            logger.error(`Użytkownik ${userId} nie należy do żadnego gospodarstwa.`);
            return res.status(400).json({ status: 'error', message: 'Użytkownik nie należy do żadnego gospodarstwa.' });
        };

        const userHouse = checkHouse.houseId;

        const [checkBudgetDate] = await connection.query(initialBudgetQueries.getAddedAt, [userHouse]);

        if (checkBudgetDate.length && checkBudgetDate[0].addedAt) {
            const lastAddedAt = new Date(checkBudgetDate[0].addedAt);
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate - lastAddedAt);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 7 || diffDays >= 30) {
                const { addedAtFormatted, validUntilFormatted, valueToDb } = await addNewBudget(connection, value, userHouse);
                await connection.query('UPDATE households SET initBudget = ? WHERE houseId =?', [valueToDb, userHouse]);

                if (diffDays <= 7) {
                    await clearExtraValues(connection, userHouse, lastAddedAt);
                    logger.info(`Usunięto dodatkowe wartości dla gospodarstwa ${userHouse}`);
                }

                logger.info(`Budżet miesięczny gospodarstwa ${userHouse} został dodany dnia ${new Date().toLocaleString()}`);

                await connection.commit();

                await broadcastToHouseMates(userHouse, {
                    type: 'initial_budget',
                    data: {
                        initBudget: valueToDb,
                        budgetPeriod: `${addedAtFormatted} - ${validUntilFormatted}`,
                        message: 'Zadeklarowano budżet na nowy miesiąc!',
                    }
                });

                return res.status(201).json({ status: 'success', message: 'Budżet miesięczny dodany!' });
            } else {
                return res.status(400).json({
                    status: 'error',
                    message: 'Nowy budżet można dodać tylko do 7 dni lub po minięciu 30 dni od daty ostatnio zdefiniowanego budżetu.',
                });
            }

        } else if (checkBudgetDate.length && !checkBudgetDate[0].addedAt) {
            const { addedAtFormatted, validUntilFormatted, valueToDb } = await addNewBudget(connection, value, userHouse);

            await connection.query('UPDATE households SET initBudget = ? WHERE houseId =?', [valueToDb, userHouse]);

            logger.info(`Budżet miesięczny gospodarstwa ${userHouse} został dodany dnia ${new Date().toLocaleString()}`);

            await connection.commit();

            await broadcastToHouseMates(userHouse, {
                type: 'initial_budget',
                data: {
                    initBudget: valueToDb,
                    budgetPeriod: `${addedAtFormatted} - ${validUntilFormatted}`,
                    message: 'Zadeklarowano budżet na nowy miesiąc!',
                }
            });

            return res.status(201).json({ status: 'success', message: 'Budżet miesięczny dodany!' });
        }

    } catch (error) {
        logger.error(`Wystąpił błąd podczas dodawania budżetu miesięcznego: ${error.message}`);
        await connection.rollback();
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    } finally {
        if (connection) connection.release();
    }
};
