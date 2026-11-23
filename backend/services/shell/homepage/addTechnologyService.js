import logger from '../../../configs/logger.js';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../../utils/errors/AppError.js';
import { createTechnology } from '../../../database/shell.js';

export const addTechnologyContent = async (name, icon) => {
  try {
    const id = uuidv4();
    await createTechnology({ id, name, icon });
    return { httpStatus: 201, messageKey: `Technology ${name} added correctly.` };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`addTechnologyContent error: ${error}`);
    throw new AppError({ code: 'SHELL_HP_2', messageKey: 'Internal server error.', httpStatus: 500 });
  }
};