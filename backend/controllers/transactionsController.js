import { runController } from '../utils/http/runController.js';
import { AppError } from '../utils/errors/AppError.js';
import { addNewAction as addNewActionService } from '../services/transactions/addNewAction.js';
import { deleteAction as deleteActionService } from '../services/transactions/deleteAction.js';
import { getActionsCollection } from '../services/transactions/getActionsCollection.js';
import { getHouseActions as getHouseActionsService } from '../services/transactions/getHouseActions.js';

export async function addNewAction(req, res) {
  const { type, value, catId } = req.body;
  const userId = req.userId;
  return runController(res, async () => {
    if (!type || !value || !catId) {
      throw new AppError({
        code: 'TX_CTRL_INPUT',
        messageKey: 'Invalid input data.',
        httpStatus: 400,
      });
    }
    return addNewActionService(userId, type, value, catId);
  });
}

export async function getAllActions(req, res) {
  return runController(res, () => getActionsCollection());
}

export async function getHouseActions(req, res) {
  return runController(res, () => getHouseActionsService(req.userId));
}

export async function deleteAction(req, res) {
  return runController(res, () => deleteActionService(req.body.transactionId, req.userId));
}
