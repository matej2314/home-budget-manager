const { handleNotification } = require('../../utils/handleNotification');
const { v4: uuidv4 } = require('uuid');

export const addUserByMate = async (connection, invitingUserId, invitedUser, houseId, userName, invitingUserName) => {

    const invitedUserId = invitedUser.id;
    const getHost = await connection.query('SELECT userId FROM householdUsers WHERE houseid=? AND role=?', [houseId, 'host']);
    const hostId = getHost[0];

    try {
        const invitationId = uuidv4();
        await connection.query('INSERT INTO invitations (id, invitingUserId, invitedUserId, houseId, hostId)', [invitationId, invitingUserId, invitedUserId, houseId, hostId]);

        const extraData = {
            invitingUser: invitingUserName,
            invitedUser: userName,
        };

        await handleNotification({
            id: hostId,
            category: 'invitation',
            houseId,
            message: 'New invitation to check!',
            extraData
        })

    } catch (error) {

    }
}