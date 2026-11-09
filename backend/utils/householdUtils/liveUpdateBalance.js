const logger = require('../../configs/logger');
const { broadcastToHouseMates } = require('../../configs/websocketConfig');

exports.liveUpdateBalance = async (type, value, houseId, userId, connection) => {
	try {
		const [houseBalance] = await connection.query('SELECT currentBalance, initBudget FROM households WHERE houseId=?', [houseId]);

		if (houseBalance.length === 0) {
			logger.error(`Gospodarstwo ${houseId} nie istnieje.`);
			return;
		}

		let newBalance = parseFloat(houseBalance[0].currentBalance) || parseFloat(houseBalance[0].initBudget);

		if (type === 'income') {
			newBalance += parseFloat(value);
		} else if (type === 'expense') {
			newBalance -= parseFloat(value);
		};

		const newBalanceToDb = parseFloat(newBalance);

		const [addNewBalance] = await connection.query('UPDATE households SET currentBalance = ? WHERE houseId = ?', [newBalanceToDb, houseId]);
		logger.info(`Nowe saldo gospodarstwa ${houseId}: ${newBalanceToDb}`);

		try {
			await broadcastToHouseMates(houseId, {
				type: 'balance_update',
				data: {
					houseId: houseId,
					newBalance: newBalanceToDb,
				},
			});

		} catch (error) {
			logger.error(`liveupdate websocket error: ${error.message}`);
			broadcastMessage(userId, {
				type: 'error',
				data: {
					message: 'Websocket error.',
				}
			})
		}
	} catch (error) {
		logger.error(`Failed to update balance of household ${houseId}: ${error.message}`);
	} finally {
		if (connection) connection.release();
	}
};
