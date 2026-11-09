import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import actionQueries from '../../database/transactionsQueries.js';
import checkHouse from '../../utils/checkUtils/checkUserHouse.js';
import { validTransactionTypes } from '../../utils/validation.js';
import { liveUpdateBalance } from '../../utils/householdUtils/liveUpdateBalance.js';
import { handleNotification } from '../../utils/handleNotification.js';

const addNewAction = async (userId, type, value, catId) => {
	const transactionId = uuidv4();
	const id = uuidv4();

	const validTypes = validTransactionTypes;

	if (!type || !validTypes.includes(type)) {
		logger.error('Invalid input data.');
		return {
			status: 'nodata',
			message: 'Invalid input data.',
		};
	}

	const connection = await pool.getConnection();

	try {
		await connection.beginTransaction();

		const houseData = await checkHouse(connection, userId);

		if (!houseData) {
			logger.error(`User ${userId} does not belong to any household.`);
			return {
				status: 'error',
				message: `User ${userId} does not belong to any household.`,
			};
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
			status: 'success',
			message: "addTransaction.addTransactionCorrect",
			transactionId,
		};
	} catch (error) {
		await connection.rollback();
		logger.error(`An error occured during adding transaction: ${error.message}`);
		return {
			status: 'error',
			message: "addTransaction.addTransactionError",
		};
	} finally {
		if (connection) connection.release();
	}
};

export { addNewAction };
