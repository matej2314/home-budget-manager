import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import actionQueries from '../../database/transactionsQueries.js';
import checkHouse from '../../utils/checkUtils/checkUserHouse.js';
import { validTransactionTypes } from '../../utils/validation.js';
import { liveUpdateBalance } from '../../utils/householdUtils/liveUpdateBalance.js';
import { handleNotification } from '../../utils/handleNotification.js';
import { AppError } from '../../utils/errors/AppError.js';

const addNewAction = async (userId, type, value, catId) => {
	const transactionId = uuidv4();
	const id = uuidv4();

	const validTypes = validTransactionTypes;

	if (!type || !validTypes.includes(type)) {
		logger.error('Invalid input data.');
		throw new AppError({ code: 'TX_1', messageKey: 'Invalid input data.', httpStatus: 400 });
	}

	const connection = await pool.getConnection();

	try {
		await connection.beginTransaction();

		const houseData = await checkHouse(connection, userId);

		if (!houseData) {
			logger.error(`User ${userId} does not belong to any household.`);
			throw new AppError({ code: 'TRANSACT_F2', messageKey: `User ${userId} does not belong to any household.`, httpStatus: 500 });
		}

		const houseId = houseData.houseId;
		const valueToDb = parseFloat(value) * 100 / 100;

		const addActionQuery = actionQueries.newitemQuery;
		await connection.query(addActionQuery, [id, transactionId, userId, houseId, catId, type, valueToDb]);

		logger.info(`Transaction ${transactionId} successfully added to household: ${houseId}.`);

		await liveUpdateBalance(type, value, houseId, userId, connection);

		await connection.commit();

		await handleNotification({
			id,
			category: 'transactions',
			houseId: houseId,
			message: 'notifications.addedAction',
			extraData: {
				action: 'addTransaction',
			}
		});

		return {
			messageKey: "addTransaction.addTransactionCorrect",
			transactionId,
		};
	} catch (error) {
        if (error instanceof AppError) throw error;
		await connection.rollback();
		logger.error(`An error occured during adding transaction: ${error.message}`);
		throw new AppError({ code: 'TRANSACT_F1', messageKey: "addTransaction.addTransactionError", httpStatus: 500 });
	} finally {
		if (connection) connection.release();
	}
};

export { addNewAction };
