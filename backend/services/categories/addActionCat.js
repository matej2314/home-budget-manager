import logger from '../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../utils/errors/AppError.js';
import { createCategory } from '../../database/categories.js';

const addActionCat = async (name, type) => {
  const id = uuidv4();

  try {
    if (!name || !name.trim() || !type || !type.trim()) {
      logger.error(`No required transaction category details.`);
      throw new AppError({ code: 'CAT_1', messageKey: 'Invalid input data.', httpStatus: 400 });
    }

    await createCategory({ id, name, type });

    return {
      messageKey: `Transaction category ${name} added correctly.`,
      catId: id,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`actioncat/new error: ${error}`);
    throw new AppError({
      code: 'CAT_3',
      messageKey: 'Adding new transaction category error.',
      httpStatus: 500,
    });
  }
};

export { addActionCat };