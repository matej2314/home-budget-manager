import logger from '../../../configs/logger.js';
import { getFilesList } from '../../../utils/getFilesList.js';
import { AppError } from '../../../utils/errors/AppError.js';
import { listReviews, listTechnologies } from '../../../database/shell.js';

function mapReviewRow(row) {
  return {
    id: row.id,
    rating: row.rating,
    userName: row.userName,
    content: row.content,
    userId: row.userId,
    date: row.date,
  };
}

export const getHomePageCollection = async () => {
  try {
    const homePageData = {};
    homePageData.technologies = await listTechnologies();

    const reviews = await listReviews();
    homePageData.reviews = reviews.map(mapReviewRow);
    homePageData.shots = await getFilesList('../app-images');

    return {
      messageKey: 'Home page data fetched correctly.',
      homePageData,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`getDataCollection error: ${error}`);
    throw new AppError({ code: 'SHELL_HP_2', messageKey: 'Internal server error.', httpStatus: 500 });
  }
};