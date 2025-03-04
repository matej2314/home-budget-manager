const pool = require('../../database/db');
const logger = require('../../configs/logger');
const usersQueries = require('../../database/usersQueries');
const checkUserHouse = require('../../utils/checkUtils/checkUserHouse');
const { broadcastToHouseMates } = require('../../configs/websocketConfig');

const addUserToHouse = async (userId, userName) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const hostHouse = await checkUserHouse(connection, userId);

        const hostHouseId = hostHouse.houseId;

        const [getInvitedUser] = await connection.query(usersQueries.selectUserByName, [userName]);

        if (getInvitedUser.length > 0) {
            const invitedUser = getInvitedUser[0];
            const invitedUserId = invitedUser.id;

            if (invitedUser.inmate == 0 && invitedUser.host == 0) {
                const [addMate] = await connection.query(usersQueries.mateQuery, [1, 'inmate', invitedUser.id]);
                if (addMate.affectedRows == 1) {

                    const [updateHouseId] = await connection.query(usersQueries.updatehouseIdHu, [hostHouseId, invitedUserId]);

                    if (updateHouseId.affectedRows == 1) {
                        await connection.query(usersQueries.updateroleHu, ['inmate', invitedUser.id]);
                    }
                };

                await broadcastToHouseMates(hostHouseId, {
                    type: 'notification',
                    data: {
                        category: 'usersActions',
                        message: 'New housemate added!',
                    }
                });

                await connection.commit();
                logger.info(`User ${userName} correctly added to household.`);
                return {
                    status: 'success',
                    message: `User ${userName} correctly added to household.`,
                };
            } else {
                logger.info(`User ${userName} already is housemate or host.`);
                await connection.rollback();
                return {
                    status: 'inmate',
                    message: `User ${userName} already is housemate or host.`,
                };
            }
        } else {
            logger.error(`User ${userName} not found.`);
            await connection.rollback();
            return {
                status: 'badreq',
                message: `User ${userName} not found.`,
            };
        }
    } catch (error) {
        await connection.rollback();
        logger.error(`inviteUser error: ${error}`);
        return { status: 'error', message: 'Internal server error.' };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { addUserToHouse };