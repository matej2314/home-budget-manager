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
            message: 'Prześlij poprawną opinię!'
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
                    message: 'Nie udało się dodać opinii.'
                });
            case 1:
                return res.status(statusCode.CREATED).json({
                    status: 'success',
                    message: 'Opinia dodana poprawnie.'
                });
        };
    } catch (error) {
        logger.error(`Błąd w addReview: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania.'
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
                message: 'Nie znaleziono opinii o aplikacji.'
            });
        }

        return res.status(statusCode.OK).json({
            status: 'success',
            message: 'Opinie pobrano poprawnie.',
            reviews,
        });

    } catch (error) {
        logger.error(`Błąd w getReviewsCollection: ${error}`);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania.'
        });
    } finally {
        connection.release();
    }
};