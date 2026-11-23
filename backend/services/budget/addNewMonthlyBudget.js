import { v4 as uuidv4 } from 'uuid';
import logger from '../../configs/logger.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import {
  addNewBudget,
  clearExtraValues,
} from '../../utils/householdUtils/initMonthlyBudgetFunctions.js';
import { handleBroadcastInitBudget } from '../../utils/handleBroadcastInitBudget.js';
import { listAddedAtByHouse } from '../../database/budget.js';
import { updateInitBudget } from '../../database/households.js';
import { AppError } from '../../utils/errors/AppError.js';

export async function addNewMonthlyBudget({ userId, value }) {
  const id = uuidv4();
  if (!value) {
    throw new AppError({
      code: 'BUDGET_INPUT',
      messageKey: 'declareBudget.inputError',
      httpStatus: 400,
    });
  }

  try {
    const checkHouse = await checkUserHouse(userId);
    if (!checkHouse) {
      logger.error(`User ${userId} does not belong to any household.`);
      throw new AppError({
        code: 'BUDGET_NO_HOUSE',
        messageKey: 'declareBudget.userError',
        httpStatus: 400,
      });
    }

    const userHouse = checkHouse.houseId;
    const checkBudgetDate = await listAddedAtByHouse(userHouse);

    if (checkBudgetDate.length && checkBudgetDate[0].addedAt) {
      const lastAddedAt = new Date(checkBudgetDate[0].addedAt);
      const currentDate = new Date();
      const diffDays = Math.ceil(Math.abs(currentDate - lastAddedAt) / (1000 * 60 * 60 * 24));

      if (diffDays <= 7 || diffDays >= 30) {
        const { addedAtFormatted, validUntilFormatted, valueToDb } = await addNewBudget(
          value,
          userHouse,
        );
        await updateInitBudget(userHouse, valueToDb);
        if (diffDays <= 7) {
          await clearExtraValues(userHouse, lastAddedAt);
          logger.info(`Deleted extra values for household: ${userHouse}`);
        }
        logger.info(
          `Monthly budget of household ${userHouse} added on ${new Date().toLocaleString()}`,
        );
        await handleBroadcastInitBudget(
          id,
          valueToDb,
          addedAtFormatted,
          validUntilFormatted,
          userHouse,
        );
        return {
          httpStatus: 201,
          messageKey: 'declareBudget.declaredCorrectlyMessage',
        };
      }

      throw new AppError({
        code: 'BUDGET_CONDITION',
        messageKey: 'declareBudget.conditionError',
        httpStatus: 400,
      });
    }

    if (checkBudgetDate.length && !checkBudgetDate[0].addedAt) {
      const { addedAtFormatted, validUntilFormatted, valueToDb } = await addNewBudget(
        value,
        userHouse,
      );
      await updateInitBudget(userHouse, valueToDb);
      logger.info(
        `Monthly budget of household ${userHouse} added on ${new Date().toLocaleString()}`,
      );
      await handleBroadcastInitBudget(
        id,
        valueToDb,
        addedAtFormatted,
        validUntilFormatted,
        userHouse,
      );
      return {
        httpStatus: 201,
        messageKey: 'declareBudget.declaredCorrectlyMessage',
      };
    }

    throw new AppError({
      code: 'BUDGET_UNEXPECTED',
      messageKey: 'declareBudget.declareInternalError',
      httpStatus: 500,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`An error occured during declaring new monthly budget: ${error.message}`);
    throw new AppError({
      code: 'BUDGET_INTERNAL',
      messageKey: 'declareBudget.declareInternalError',
      httpStatus: 500,
    });
  }
}