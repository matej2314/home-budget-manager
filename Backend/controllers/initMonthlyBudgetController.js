const pool = require('../database/db');
const logger = require('../configs/logger');
const { v4: uuidv4 } = require('uuid');
const checkUserHouse = require('../utils/checkUtils/checkUserHouse.js');
const { addNewBudget, clearExtraValues } = require('../utils/householdUtils/initMonthlyBudgetFunctions.js');
const { handleBroadcastInitBudget } = require('../utils/handleBroadcastInitBudget.js');
const initialBudgetQueries = require('../database/initialMonthlyBudgetQueries.js');
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

exports.addNewMonthlyBudget = async (req, res) => {
    const userId = req.userId;
    const { value } = req.body;
    const id = uuidv4();

    if (!value) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: "declareBudget.inputError"
        });
    };

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const checkHouse = await checkUserHouse(connection, userId);
        if (!checkHouse) {
            logger.error(`User ${userId} does not belong to any household.`);
            return res.status(statusCode.BAD_REQUEST).json({
                status: 'error',
                message: "declareBudget.userError"
            });
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
                    logger.info(`Deleted extra values for household: ${userHouse}`);
                }

                logger.info(`Monthly budget of household ${userHouse} added on ${new Date().toLocaleString()}`);

                await connection.commit();

                await handleBroadcastInitBudget(id, valueToDb, addedAtFormatted, validUntilFormatted, userHouse);

                return res.status(statusCode.CREATED).json({
                    status: 'success',
                    message: "declareBudget.declaredCorrectlyMessage"
                });
            } else {
                return res.status(statusCode.BAD_REQUEST).json({
                    status: 'error',
                    message: "declareBudget.conditionError",
                });
            }

        } else if (checkBudgetDate.length && !checkBudgetDate[0].addedAt) {
            const { addedAtFormatted, validUntilFormatted, valueToDb } = await addNewBudget(connection, value, userHouse);

            await connection.query('UPDATE households SET initBudget = ? WHERE houseId =?', [valueToDb, userHouse]);

            logger.info(`Monthly budget of household ${userHouse} added on ${new Date().toLocaleString()}`);

            await connection.commit();

            await handleBroadcastInitBudget(id, valueToDb, addedAtFormatted, validUntilFormatted, userHouse);

            return res.status(statusCode.CREATED).json({
                status: 'success',
                message: "declareBudget.declaredCorrectlyMessage"
            });
        }

    } catch (error) {
        logger.error(`An error occured during declaring new monthly budget: ${error.message}`);
        await connection.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: "declareBudget.declareInternalError"
        });
    } finally {
        if (connection) connection.release();
    }
};
