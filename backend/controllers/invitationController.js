const pool = require('../database/db');
const logger = require('../configs/logger');
const { v4: uuidv4 } = require('uuid');
const usersQueries = require('../database/usersQueries');
const { saveNewHousemate } = require('../utils/householdUtils/saveNewHousemate');
const { handleNotification } = require('../utils/handleNotification');
const checkUserHouse = require('../utils/checkUtils/checkUserHouse');
const { invitationStatus } = require('../utils/invitationStatus');
const invitationQueries = require('../database/invitationsQueries');
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

exports.acceptInvitation = async (req, res) => {
    const { invitationId, invitedUserId } = req.body;
    const hostId = req.userId;

    const connection = await pool.getConnection();

    try {
        const hostHouseId = await checkUserHouse(connection, hostId);

        if (!hostHouseId || !hostHouseId.houseId) {
            return res.status(statusCode.BAD_REQUEST).json({
                status: 'error',
                message: `You don't belong to any household`,
            });
        }

        const houseId = hostHouseId.houseId;

        const saveMate = await saveNewHousemate(usersQueries, invitedUserId, houseId, connection);

        if (saveMate.status === 'error') {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to accept invitation. Failed to save new housemate.',
            });
        }

        const [confirmInvitation] = await connection.query(
            invitationQueries.acceptQuery, [invitationStatus.accepted, invitationId, hostId]);

        if (confirmInvitation.affectedRows === 0) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to accept invitation.',
            });
        }

        const noticeId = uuidv4();

        handleNotification({
            noticeId,
            category: 'usersActions',
            houseId,
            message: 'notifications.addedHouseMate',
        });

        return res.status(statusCode.OK).json({
            status: 'success',
            message: `Invitation of user ${invitedUserId} correctly accepted.`,
        });
    } catch (error) {
        logger.error(`acceptInvitation error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.',
        });
    } finally {
        connection.release();
    }
};


exports.rejectInvitation = async (req, res) => {
    const invitationId = req.body.invitationId;
    const hostId = req.userId;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const [rows] = await connection.query(invitationQueries.getInvitationQuery, [invitationId]);
        const invitationData = rows[0];

        if (invitationData.length == 0 || invitationData.status !== 'new') {
            await connection.rollback();
            return res.status(statusCode.NOT_FOUND).json({
                status: 'error',
                message: 'Invitation not found',
            });
        };

        const [rejectResult] = await connection.query(invitationQueries.rejectQuery, [invitationStatus.rejected, invitationId]);

        if (rejectResult.affectedRows == 0) {
            await connection.rollback();
            return res.status(statusCode.NOT_FOUND).json({
                status: 'error',
                message: 'Invitation not found',
            });
        };

        const noticeId = uuidv4();
        const houseId = invitationData.houseId;

        handleNotification({
            id: noticeId,
            category: 'usersActions',
            houseId,
            message: 'Rejected invitation of new user',
            extraData: {
                invitedUserId: invitationData.invitedUserId
            }
        })

        await connection.commit();

        return res.status(statusCode.OK).json({
            status: 'success',
            message: 'Invitation successfully rejected.'
        });
    } catch (error) {
        await connection.rollback();
        logger.error(`error in rejectInvitation: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error',
        });
    } finally {
        connection.release();
    }
};

exports.getInvitationsCollection = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const [invitations] = await connection.query(invitationQueries.invitationsCollectionQuery, [invitationStatus.new]);

        if (invitations.length < 0) {
            return res.status(statusCode.NOT_FOUND).json({
                status: 'error',
                message: 'Invitations not found.',
            });
        };

        return res.status(statusCode.OK).json({
            status: 'success',
            invitations,
        });
    } catch (error) {
        logger.error(`getInvitationsCollection error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error',
        });
    } finally {
        connection.release();
    }
};