const pool = require('../../database/db');
const logger = require('../../configs/logger');
const usersQueries = require('../../database/usersQueries');
const checkUserHouse = require('../../utils/checkUserHouse');
const { broadcastToHouseMates } = require('../../configs/websocketConfig');

const deleteInhabitant = async (inhabitantId) => {

    if (!inhabitantId) {
        return {
            status: 'badreq',
            message: 'Brak wymaganych danych: inhabitantId.',
        };
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const inhabitantHouse = await checkUserHouse(connection, inhabitantId);

        const inhabitantHouseId = inhabitantHouse.houseId;

        const [deleteHouseIdHu] = await connection.query(
            usersQueries.updatehouseIdHu,
            [0, inhabitantId]
        );

        if (deleteHouseIdHu.affectedRows !== 1) logger.error(`Nie udało się zaktualizować houseId użytkownika: ${inhabitantId}`);
        

        const [delUserActions] = await connection.query(usersQueries.delUsersActions, [inhabitantId]);

        if (delUserActions.affectedRows == 0) logger.error(`Nie udało się usunąć transakcji użytkownika: ${inhabitantId}`);

        const [changeRoleHu] = await connection.query(
            usersQueries.updateroleHu,
            ['user', inhabitantId]
        );

        if (changeRoleHu.affectedRows !== 1) logger.error(`Nie udało się zmienić roli użytkownika: ${inhabitantId}`);
        

        await connection.query(
            usersQueries.mateQuery,
            [0, 'user', inhabitantId]
        );

        await connection.commit();

        await broadcastToHouseMates(inhabitantHouseId, {
            type: 'notification',
            data: {
                category: 'usersActions',
                message: 'Usunięto domownika.',
            },
        });

        return {
            status: 'success',
            message: 'Domownik został pomyślnie usunięty.',
        };
    } catch (error) {
        await connection.rollback();
        logger.error(`Nie udało się usunąć domownika: ${error.message}`);
        return {
            status: 'error',
            message: 'Nie udało się usunąć domownika.',
        };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { deleteInhabitant };