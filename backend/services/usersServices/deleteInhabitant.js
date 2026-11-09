const pool = require('../../database/db');
const logger = require('../../configs/logger');
const usersQueries = require('../../database/usersQueries');
const checkUserHouse = require('../../utils/checkUtils/checkUserHouse');
const { v4: uuidv4 } = require('uuid');
const { handleNotification } = require('../../utils/handleNotification');

const deleteInhabitant = async (inhabitantId) => {

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const inhabitantHouse = await checkUserHouse(connection, inhabitantId);

        const inhabitantHouseId = inhabitantHouse.houseId;

        const [deleteHouseIdHu] = await connection.query(
            usersQueries.updatehouseIdHu,
            [0, inhabitantId]
        );

        if (deleteHouseIdHu.affectedRows !== 1) logger.error(`Failed to update houseId for user: ${inhabitantId}`);


        const [delUserActions] = await connection.query(usersQueries.delUsersActions, [inhabitantId]);

        if (delUserActions.affectedRows == 0) logger.error(`Failed to delete transactions of user: ${inhabitantId}`);

        const [changeRoleHu] = await connection.query(
            usersQueries.updateroleHu,
            ['user', inhabitantId]
        );

        if (changeRoleHu.affectedRows !== 1) logger.error(`Failed to change role for user: ${inhabitantId}`);


        await connection.query(
            usersQueries.mateQuery,
            [0, 'user', inhabitantId]
        );

        await connection.commit();
        const id = uuidv4();

        await handleNotification({
            id,
            category: 'usersActions',
            houseId: inhabitantHouseId,
            message: 'notifications.deletedHouseMate',
        })
        return {
            status: 'success',
            message: 'Housemate deleted correctly.',
        };
    } catch (error) {
        await connection.rollback();
        logger.error(`Failed to deleting housemate: ${error.message}`);
        return {
            status: 'error',
            message: 'Failed to delete housemate.',
        };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { deleteInhabitant };