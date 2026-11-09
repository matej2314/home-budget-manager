const { v4: uuidv4 } = require('uuid');
const logger = require('../../configs/logger');
const usersQueries = require('../../database/usersQueries');
const { handleNotification } = require('../../utils/handleNotification');
const { saveNewHousemate } = require('./saveNewHousemate');

exports.addUserByHost = async (connection, userName, houseId, invitedUserData) => {

    try {

        if (invitedUserData) {
            const invitedUser = invitedUserData;
            const invitedUserId = invitedUserData.userId;

            if (invitedUser.houseId == 0) {

                await saveNewHousemate(usersQueries, invitedUserId, houseId, connection);

                const id = uuidv4();

                await handleNotification({
                    id,
                    category: 'usersActions',
                    houseId,
                    message: 'notifications.addedHouseMate',
                });

                logger.info(`User ${userName} correctly added to household.`);
                return {
                    status: 'success',
                    message: "addUserToHouse.inviteSuccessMessage",
                };
            } else {
                logger.info(`User ${userName} already is housemate or host.`);

                return {
                    status: 'inmate',
                    message: "addUserToHouse.inmateOrHostError",
                };
            }
        } else {
            logger.error(`User ${userName} not found.`);

            return {
                status: 'badreq',
                message: "addUserToHouse.userNotFoundError",
            };
        }
    } catch (error) {
        logger.error(`inviteUser error:`, error);
        return { status: 'error', message: "addUserToHouse.inviteUserInternalError" };
    }
}