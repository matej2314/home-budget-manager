const pool = require('../database/db');
const logger = require('../configs/logger');
const checkUserHouse = require('../utils/checkUtils/checkUserHouse');
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

exports.GetNoticesCollection = async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Incorrect input data.',
        });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const checkHouse = await checkUserHouse(connection, userId);

        if (!checkHouse) {
            logger.error(`User ${userId} does not belong to any household.`);
            await connection.rollback();
            return res.status(statusCode.FORBIDDEN).json({
                status: 'error',
                message: 'User does not belong to any household.',
            });
        }

        const houseId = checkHouse.houseId;
        const [notifications] = await connection.query(
            `SELECT id, category, noticeData FROM notifications WHERE houseId=?`,
            [houseId]
        );

        if (notifications.length === 0) {
            await connection.commit();
            return res.status(statusCode.NOT_FOUND).json({
                status: 'error',
                message: 'Notifications not found.',
            });
        }

        await connection.commit();

        return res.status(statusCode.OK).json({
            status: 'success',
            message: 'Notifications fetched correctly.',
            notifications,
        });

    } catch (error) {
        logger.error(`ERROR in getNoticesCollection: ${error}`);
        await connection.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to fetch notifications.',
        });
    } finally {
        if (connection) connection.release();
    }
};

exports.saveNotification = async (category, noticeData, houseId) => {
    if (!category || !noticeData || !houseId) {
        return {
            status: 'error',
            message: 'Invalid input data.',
        };
    }

    const connection = await pool.getConnection();

    try {
        const id = uuidv4();
        const [addNotice] = await connection.query(
            `INSERT INTO notifications (id, category, noticeData, houseId) VALUES (?, ?, ?, ?)`,
            [id, category, noticeData, houseId]
        );

        if (addNotice.affectedRows === 0) {
            return {
                status: 'error',
                message: 'Failed to add notification.',
            };
        }

        return {
            status: 'success',
            message: 'Notification saved correctly.',
        };

    } catch (error) {
        logger.error(`saveNotification error: ${error}`);
        return {
            status: 'error',
            message: 'Failed to save notification.',
        };
    } finally {
        if (connection) connection.release();
    }
};

exports.deleteNotification = async (req, res) => {
    const noticeId = req.body.noticeId;
    const userId = req.userId;

    if (!noticeId) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Invalid input data.',
        })
    };

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const checkHouse = await checkUserHouse(connection, userId);

        if (!checkHouse) {
            return res.status(statusCode.FORBIDDEN).json({
                status: 'error',
                message: 'User does not belong to any household',
            });
        };

        const houseId = checkHouse.houseId;

        const [deleteNotice] = await connection.query('DELETE FROM notifications WHERE id=? AND houseId=?', [noticeId, houseId]);

        if (deleteNotice.affectedRows === 0) {
            return res.status(statusCode.NOT_FOUND).json({
                status: 'error',
                message: 'Failed to delete notification',
            });
        }

        await connection.commit();

        return res.status(statusCode.OK).json({
            status: 'success',
            message: 'Notification removed correctly',
        });

    } catch (error) {
        await connection.rollback();
        logger.error(`Error in deleteNotification: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Failed to delete notification.',
        });
    } finally {
        if (connection) connection.release();
    }
};
