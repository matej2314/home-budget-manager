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
                        message: 'Nowy domownik w gospodarstwie!',
                    }
                });

                await connection.commit();
                logger.info(`Użytkownik ${userName} został dodany do gospodarstwa.`);
                return {
                    status: 'success',
                    message: `Użytkownik ${userName} został dodany do gospodarstwa.`,
                };
            } else {
                logger.info(`Użytkownik ${userName} jest już domownikiem lub gospodarzem.`);
                await connection.rollback();
                return {
                    status: 'inmate',
                    message: `Użytkownik ${userName} jest już domownikiem lub gospodarzem.`,
                };
            }
        } else {
            logger.error(`Brak użytkownika ${userName}`);
            await connection.rollback();
            return {
                status: 'badreq',
                message: `Brak użytkownika ${userName}`,
            };
        }
    } catch (error) {
        await connection.rollback();
        logger.error(`Error w inviteUser: ${error}`);
        return { status: 'error', message: 'Błąd przetwarzania żądania.' };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { addUserToHouse };