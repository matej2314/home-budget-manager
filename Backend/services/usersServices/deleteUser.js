const pool = require('../../database/db');
const logger = require('../../configs/logger');
const checkUserHouse = require('../../utils/checkUtils/checkUserHouse');

const deleteUser = async (userId) => {
    const connection = await pool.getConnection();

    if (!userId) {
        logger.error(`Brak ID użytkownika do usunięcia.`);
        return { status: 'badreq', message: 'Brak danych użytkownika do usunięcia.' };
    };

    try {
        await connection.beginTransaction();
        logger.info(`Usuwanie użytkowwnika ${userId} rozpoczęte.`);
        const [checkIsHost] = await connection.query('SELECT host FROM users WHERE id=?', [userId]);

        if (checkIsHost[0].host == 1) {
            const userHouseId = await checkUserHouse(connection, userId);
            const houseId = userHouseId.houseId;
            const [deleteHouse] = await connection.query('DELETE FROM households WHERE houseId=? AND userId=?', [houseId, userId]);

            if (deleteHouse.affectedRows === 1) {
                const [deleteUserTransactions] = await connection.query('DELETE FROM transactions WHERE userId=?', [userId]);
                logger.info('Zmiana houseId domowników (tabela householdUsers)');
                const [updateHouseHu] = await connection.query('UPDATE householdUsers SET houseId = NULL WHERE houseId = ?', [houseId]);
            };

            const [deleteFromUsers] = await connection.query('DELETE FROM users WHERE id=?', [userId]);
            if (deleteFromUsers.affectedRows == 1) {
                logger.info(`Użytkownik ${userId} usunięty z systemu.`);
            };

        } else {
            logger.info(`Użytkownik ${userId} nie jest hostem. Usuwanie jego transakcji.`);
            const [deleteFromTransactions] = await connection.query('DELETE FROM transactions WHERE userId=?', [userId]);

            if (deleteFromTransactions.length > 0) {
                logger.info(`Usuwanie użytkownika ${userId} z householdUsers`);
                const [deleteFromHu] = await connection.query('DELETE FROM householdUsers WHERE userId=?', [userId]);
            };

            logger.info(`Usuwanie użytkownika ${userId} z users`);
            const [deleteFromUsers] = await connection.query('DELETE FROM users WHERE id=?', [userId]);

        };
        await connection.commit();
        return { status: 'success', message: `Użytkownik ${userId} usunięty z systemu.` };

    } catch (error) {

        await connection.rollback();

        logger.error(`Błąd podczas usuwania użytkownika ${userId}: ${error.message}`);
        return { status: 'error', message: 'Błąd serwera.' };

    } finally {
        if (connection) connection.release();
    }
};

module.exports = { deleteUser };