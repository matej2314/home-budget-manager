const logger = require('../configs/logger');
const { broadcastToHouseMates } = require('../configs/websocketConfig');

exports.liveUpdateBalance = async (type, value, houseId, userId, connection) => {
	try {
		const [houseBalance] = await connection.query('SELECT balance FROM households WHERE houseId=?', [houseId]);

		if (houseBalance.length === 0) {
			logger.error(`Gospodarstwo ${houseId} nie istnieje.`);
			return;
		}

		let newBalance = Number(houseBalance[0].balance);

		if (type === 'income') {
			newBalance += Number(value);
		} else if (type === 'expense') {
			newBalance -= Number(value);
		}

		const [addNewBalance] = await connection.query('UPDATE households SET balance = ? WHERE houseId = ?', [newBalance, houseId]);
		logger.info(`Nowe saldo gospodarstwa ${houseId}: ${newBalance}`);

		try {
			await broadcastToHouseMates(houseId, {
				type: 'balance_update',
				data: {
					houseId: houseId,
					newBalance: newBalance,
				},
			});

		} catch (error) {
			logger.error(`Błąd websocket w liveupdate: ${error.message}`);
			broadcastMessage(userId, {
				type: 'error',
				data: {
                   message: 'Websocket error.',
				}
			})
		}
	} catch (error) {
		logger.error(`Nie udało się zaktualizować salda gospodarstwa ${houseId}: ${error.message}`);
	} finally {
		if (connection) connection.release();
	}
};
