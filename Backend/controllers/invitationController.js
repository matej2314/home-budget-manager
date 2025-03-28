const pool = require('../database/db');
const logger = require('../configs/logger');
const usersQueries = require('../database/usersQueries');
const { saveNewHousemate } = require('../utils/householdUtils/saveNewHousemate');
const checkUserHouse = require('../utils/checkUtils/checkUserHouse');

exports.acceptInvitation = async (req, res) => {
    const { invitationId, invitedUserId } = req.body;
    const hostId = req.userId;

    const connection = pool.getConnection();

    const hostHouseId = await checkUserHouse(connection, hostId);

    if (hostHouseId.length == 0) {
        return res.status(400).json({
            status: 'error',
            message: `You don't belong to any household`,
        });
    };

    const houseId = hostHouseId.houseId;

    const saveMate = await saveNewHousemate(usersQueries, invitedUserId, houseId, connection);

    if (saveMate.affectedRows == 0) {
        return res.status(500).json({
            status: 'error',
            message: 'Failed to accept invitation. Failed to save new housemate.',
        });
    };

    const [confirmInvitation] = (await connection).query('UPDATE invitations SET status =? WHERE id=? AND hostId=?', ['accepted', invitationId, hostId]);

    if (confirmInvitation.affectedRows == 0) {
        return res.status(500).json({
            status: 'error',
            message: 'Failed to accept invitation.',
        })
    };

    return res.status(200).json({
        status: 'success',
        message: `Invitation of user ${invitedUserId} correctly accepted.`,
    });
};

exports.declineInvitation = (req, res) => {

};