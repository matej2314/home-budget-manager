import logger from '../../configs/logger.js';
import { AppError } from '../../utils/errors/AppError.js';
import {
  deleteCategoriesByNameOrId,
  findCategoryByNameOrId,
} from '../../database/categories.js';

const deleteActionCat = async (catName, catId) => {
  try {
    const existing = await findCategoryByNameOrId(catName, catId);

    if (!existing) {
      throw new AppError({
        code: 'CAT_1',
        messageKey: 'Transaction category not found.',
        httpStatus: 404,
      });
    }

    const fetchedCatName = existing.name;
    const result = await deleteCategoriesByNameOrId(catName, catId);

    if (result.count === 0) {
      logger.info(`Failed to delete transaction category: ${fetchedCatName}`);
      throw new AppError({
        code: 'CAT_2',
        messageKey: 'Failed to delete transaction category.',
        httpStatus: 404,
      });
    }

    return {
      messageKey: `Transaction category ${fetchedCatName} deleted correctly.`,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`/actioncat/delete error: ${error}`);
    throw new AppError({
      code: 'CATEGORI_F1',
      messageKey: `Failed to delete transaction category.`,
      httpStatus: 500,
    });
  }
};

export { deleteActionCat };