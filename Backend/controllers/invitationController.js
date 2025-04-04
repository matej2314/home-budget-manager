const pool = require('../database/db');
const logger = require('../configs/logger');
const usersQueries = require('../database/usersQueries');
const { saveNewHousemate } = require('../utils/householdUtils/saveNewHousemate');
const checkUserHouse = require('../utils/checkUtils/checkUserHouse');

exports.acceptInvitation = async (req, res) => {
    const { invitationId, invitedUserId } = req.body;
    const hostId = req.userId;
    const acceptStatus = 'accepted';

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

    const [confirmInvitation] = (await connection).query('UPDATE invitations SET status =? WHERE id=? AND hostId=?', [acceptStatus, invitationId, hostId]);

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

exports.rejectInvitation = async (req, res) => {
    const { invitationId } = req.body;
    const hostId = req.userId;
    const status = 'rejected';

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const [invitationData] = await connection.query('SELECT status, invitingUserId, invitedUserId, houseId, hostId, date WHERE id=?', [invitationId]);

        if (invitationData.length == 0 || invitationData.status !== 'new') {
            await connection.rollback();
            return res.status(404).json({
                status: 'error',
                message: 'Invitation not found',
            });
        };

        const [rejectResult] = await connection.query('UPDATE invitations SET status=? WHERE id=? AND hostId=?', [status, invitationId, hostId]);

        if (rejectResult.affectedRows == 0) {
            await connection.rollback();
            return res.status(404).json({
                status: 'error',
                message: 'Invitation not found',
            });
        };

        await connection.commit();
        return res.status(200).json({
            status: 'success',
            message: 'Invitation successfully rejected.'
        });
    } catch (error) {
        await connection.rollback();
        logger.error(`error in rejectInvitation: ${error}`);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    };
};

exports.getInvitationsCollection = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const [invitations] = await connection.query('SELECT id, status, invitingUserId, invitedUserId, houseId, hostId, date from invitations');
        if (invitations.length < 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Invitations not found.',
            });
        };

        return res.status(200).json({
            status: 'success',
            invitations,
        });
    } catch (error) {
        logger.error(`getInvitationsCollection error: ${error}`);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};