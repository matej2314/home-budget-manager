const pool = require('../../database/db');
const logger = require('../../configs/logger');

exports.getHomePageCollection = async () => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        let homePageData = {};

        const [getTechnologies] = await connection.query('SELECT id, name, icon FROM technologies');

        homePageData.technologies = getTechnologies;

        const [getReviews] = await connection.query('SELECT id, rating,userName, content, userId, date FROM usersReviews');

        if (getReviews.affectedRows === 0) {
            return {
                status: 'error',
                message: 'Failed to fetch reviews data.'
            }
        }
        homePageData.reviews = getReviews;

        await connection.commit();

        return {
            status: 'success',
            message: 'Home page data fetched correctly.',
            homePageData
        };

    } catch (error) {
        await connection.rollback();
        logger.error(`getDataCollection error: ${error}`);
        return { status: 'error', message: 'Internal server error.' };
    } finally {
        if (connection) connection.release();
    }
}