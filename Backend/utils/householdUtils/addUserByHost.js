const { v4: uuidv4 } = require('uuid');
const logger = require('../../configs/logger');
const usersQueries = require('../../database/usersQueries');
const checkUserHouse = require('../../utils/checkUtils/checkUserHouse');
const { handleNotification } = require('../../utils/handleNotification');
const { saveNewHousemate } = require('./saveNewHousemate');

exports.addUserByHost = async (connection, userName, houseId, invitedUserData) => {

    try {
        await connection.beginTransaction();

        if (invitedUserData.length > 0) {
            const invitedUser = invitedUserData;
            const invitedUserId = invitedUserData.id;

            if (invitedUser.mate == 0 && invitedUser.host == 0) {

                await saveNewHousemate(usersQueries, invitedUserId, houseId, connection);

                const id = uuidv4();

                await handleNotification({
                    id,
                    category: 'usersActions',
                    message: 'notifications.addedHouseMate',
                });

                await connection.commit();
                logger.info(`User ${userName} correctly added to household.`);
                return {
                    status: 'success',
                    message: "addUserToHouse.inviteSuccessMessage",
                };
            } else {
                logger.info(`User ${userName} already is housemate or host.`);
                await connection.rollback();
                return {
                    status: 'inmate',
                    message: "addUserToHouse.inmateOrHostError",
                };
            }
        } else {
            logger.error(`User ${userName} not found.`);
            await connection.rollback();
            return {
                status: 'badreq',
                message: "addUserToHouse.userNotFoundError",
            };
        }
    } catch (error) {
        await connection.rollback();
        logger.error(`inviteUser error: ${error}`);
        return { status: 'error', message: "addUserToHouse.inviteUserInternalError" };
    } finally {
        if (connection) connection.release();
    }
}