import logger from '../../configs/logger.js';
import { broadcastMessage } from '../../configs/websocketConfig.js';
import { v4 as uuidv4 } from 'uuid';
import { invitationStatus } from '../../utils/invitationStatus.js';

export const addUserByMate = async (connection, invitingUserId, invitedUser, houseId, userName, invitingUserName) => {

    try {
        if (invitedUser) {
            if (invitedUser.houseId == 0) {
                const invitedUserId = invitedUser.userId;
                const [getHost] = await connection.query('SELECT userId FROM householdUsers WHERE houseid=? AND role=?', [houseId, 'host']);
                const hostId = getHost[0].userId;
                const invitationId = uuidv4();

                const [insertResult] = await connection.query('INSERT INTO invitations (id, status, invitingUserId, invitedUserId, houseId, hostId) VALUES (?,?,?,?,?,?)', [invitationId, invitationStatus.new, invitingUserId, invitedUserId, houseId, hostId]);
                console.log(`insertresult:`, insertResult);
                const extraData = {
                    invitationId,
                    invitingUser: invitingUserName,
                    invitedUser: userName,
                };

                broadcastMessage(hostId, { type: 'invitation', data: extraData });
                return { status: 'success', message: 'addUserToHouse.correctlyAddedByMate' }
            } else {
                return {
                    status: 'inmate',
                    message: 'addUserToHouse.inmateOrHostError'
                };
            };

        } else {
            return { status: 'badreq', message: 'addUserToHouse.invalidInputError' };
        }

    } catch (error) {
        logger.error(`addUserByMate error: ${error}`);
        return { status: 'error', message: 'addUserToHouse.inviteUserInternalError' };
    }
};
