import pool from '../../../database/db.js';
import logger from '../../../configs/logger.js';
import { getFilesList } from '../../../utils/getFilesList.js';
import { AppError } from '../../../utils/errors/AppError.js';

export const getHomePageCollection = async () => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        let homePageData = {};

        const [getTechnologies] = await connection.query('SELECT id, name, icon FROM technologies');

        homePageData.technologies = getTechnologies;

        const [getReviews] = await connection.query('SELECT id, rating,userName, content, userId, date FROM usersReviews');

        if (getReviews.affectedRows === 0) {
            throw new AppError({ code: 'SHELL_HP_1', messageKey: 'Failed to fetch reviews data.', httpStatus: 500 })
        }
        homePageData.reviews = getReviews;

        const picturesList = await getFilesList('../app-images');

        homePageData.shots = picturesList;

        await connection.commit();

        return {
            messageKey: 'Home page data fetched correctly.',
            homePageData
        };

    } catch (error) {
        if (error instanceof AppError) throw error;
        await connection.rollback();
        logger.error(`getDataCollection error: ${error}`);
        throw new AppError({ code: 'SHELL_HP_2', messageKey: 'Internal server error.', httpStatus: 500 });
    } finally {
        if (connection) connection.release();
    }
}
