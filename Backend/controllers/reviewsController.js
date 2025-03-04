const pool = require('../database/db');
const logger = require('../configs/logger');
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

exports.addReview = async (req, res) => {
    const userId = req.userId;
    const userName = req.userName;
    const { content, rating } = req.body;

    if (!content || content.trim().length === 0 || !rating) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Enter corrently opinion!'
        });
    };

    const connection = await pool.getConnection();
    const id = uuidv4();

    try {
        const [addReviewResult] = await connection.query('INSERT INTO usersReviews (id, rating, content, userName, userId) VALUES (?,?,?,?,?)', [id, rating, content, userName, userId]);

        switch (addReviewResult.affectedRows) {
            case 0:
                return res.status(statusCode.BAD_REQUEST).json({
                    status: 'error',
                    message: 'Failed to add opinion.'
                });
            case 1:
                return res.status(statusCode.CREATED).json({
                    status: 'success',
                    message: 'Opinion added correctly.'
                });
        };
    } catch (error) {
        logger.error(`addReview error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.'
        });
    } finally {
        connection.release();
    };
};

exports.getReviewsCollection = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const [reviews] = await connection.query('SELECT id, rating,userName, content, userId, date FROM usersReviews');

        if (reviews.length === 0) {
            return res.status(statusCode.NOT_FOUND).json({
                status: 'error',
                message: 'Opinions not found.'
            });
        }

        return res.status(statusCode.OK).json({
            status: 'success',
            message: 'Opinions fetched correctly.',
            reviews,
        });

    } catch (error) {
        logger.error(`getReviewsCollection error: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.'
        });
    } finally {
        connection.release();
    }
};