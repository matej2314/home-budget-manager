const { handleNotification } = require('../../utils/handleNotification');
const { broadcastMessage } = require('../../configs/websocketConfig');
const { v4: uuidv4 } = require('uuid');

exports.addUserByMate = async (connection, invitingUserId, invitedUser, houseId, userName, invitingUserName) => {

    const invitedUserId = invitedUser.id;
    const getHost = await connection.query('SELECT userId FROM householdUsers WHERE houseid=? AND role=?', [houseId, 'host']);
    const hostId = getHost[0];

    try {
        const invitationId = uuidv4();
        await connection.query('INSERT INTO invitations (id, status, invitingUserId, invitedUserId, houseId, hostId) VALUES (?,?,?,?,?,?)', [invitationId, 'new/pending', invitingUserId, invitedUserId, houseId, hostId]);

        const extraData = {
            invitationId,
            invitingUser: invitingUserName,
            invitedUser: userName,
        };

        await broadcastMessage(hostId, { type: 'invitation', data: extraData });

    } catch (error) {

    }
}