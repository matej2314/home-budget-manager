const pool = require('../../database/db');
const logger = require('../../configs/logger');

exports.getHomePageCollection = async () => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        let homePageData = {};

        const [getFunctionalities] = await connection.query('SELECT id, functionTitle, functionContent FROM functionalities');

        homePageData.functionalities = getFunctionalities;

        const [getShortInfo] = await connection.query('SELECT id, infoTitle, infoContent FROM shortProjectInfo');
        homePageData.shortInfo = getShortInfo;

        const [getReviews] = await connection.query('SELECT id, rating,userName, content, userId, date FROM usersReviews');
        homePageData.reviews = getReviews;

        await connection.commit();

        return {
            status: 'success',
            message: 'Dane pobrane poprawnie.',
            homePageData
        };

    } catch (error) {
        await connection.rollback();
        logger.error(`Błąd w getDataCollection: ${error}`);
        return { status: 'error', message: 'Błąd przetwarzania żądania.' };
    } finally {
        if (connection) connection.release();
    }
}