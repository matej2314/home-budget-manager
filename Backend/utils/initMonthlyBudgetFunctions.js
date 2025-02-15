const { v4: uuidv4 } = require('uuid');
const logger = require('../configs/logger');

const addNewBudget = async (connection, value, userHouse) => {
    try {
        const id = uuidv4();
        const addedAt = new Date();
        const validUntil = new Date(addedAt);
        validUntil.setDate(validUntil.getDate() + 30);

        const addedAtFormatted = addedAt.toISOString().split('T')[0];
        const validUntilFormatted = validUntil.toISOString().split('T')[0];
        const addedAtToDb = addedAt.toISOString();
        const valueToDb = parseFloat(value).toFixed(2);

        await connection.query('UPDATE initialMonthlyBudgets SET value=? ,validUntil=? WHERE houseId =?',
            [valueToDb, validUntilFormatted, userHouse]);

        return { addedAtFormatted, validUntilFormatted, valueToDb };
    } catch (error) {
        logger.error(error);
    }
};

const changeMonthlyBudget = async (connection, addedAt, value, userHouse) => {
    try {
        const budgetAddedAt = new Date(addedAt);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        if (new Date(budgetAddedAt) < new Date(sevenDaysAgo)) {
            throw new Error('Nie udało się znaleźć wskazanego budżetu.');
        } else {
            const { addedAtFormatted, validUntilFormatted, valueToDb } = await addNewBudget(connection, value, userHouse);

            logger.info(`Nowy budżet dodany dla gospodarstwa ${userHouse} z wartością ${valueToDb}.`);
            return { addedAtFormatted, validUntilFormatted, valueToDb };
        }
    } catch (error) {
        logger.error(error);
    }
};

//clear transactions, dailyTransactions, dailyBudgets added during 7 days (when changed init budget)
const clearExtraValues = async (connection, houseId, lastAddedAt) => {
    const today = new Date().toISOString().split('T')[0];
    const startPeriod = new Date(lastAddedAt).toISOString().split('T')[0];
    try {
        const [delActions] = await connection.query(`DELETE FROM transactions WHERE DATE_FORMAT(addedAt, '%Y-%m-%d') BETWEEN ? AND ? AND houseId=?`,
            [startPeriod, today, houseId]);

        if (delActions.affectedRows === 0) {
            logger.error(`Brak transakcji we wskazanym zakresie.`);
        };

        const [delDailyActions] = await connection.query(`DELETE FROM dailyTransactions WHERE DATE_FORMAT(date, '%Y-%m-%d') BETWEEN ? AND ? AND houseId=?`,
            [startPeriod, today, houseId]);

        if (delDailyActions.affectedRows === 0) {
            logger.error(`Brak dziennych transakcji do usunięcia.`);
        };

        const [delDailyBudgets] = await connection.query(`DELETE FROM dailyBudget WHERE DATE_FORMAT(date, '%Y-%d-%m') BETWEEN ? AND ? AND houseId=?`,
            [startPeriod, today, houseId]); 

        if (delDailyBudgets.affectedRows === 0) {
            logger.error(`Nie usunięto dziennych budżetów.`);
        };
    } catch (error) {
        logger.error(`ERROR in clearExtraValues: ${error}`);
        throw error;
    }
};


module.exports = { addNewBudget, clearExtraValues };
