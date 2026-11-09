import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import usersQueries from '../../database/usersQueries.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { v4 as uuidv4 } from 'uuid';
import { handleNotification } from '../../utils/handleNotification.js';

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

export { deleteInhabitant };
