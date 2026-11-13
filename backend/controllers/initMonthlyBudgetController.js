import { runController } from '../utils/http/runController.js';
import { addNewMonthlyBudget } from '../services/budget/addNewMonthlyBudget.js';

export async function addNewMonthlyBudgetHandler(req, res) {
  return runController(res, () =>
    addNewMonthlyBudget({ userId: req.userId, value: req.body.value }),
  );
}

export { addNewMonthlyBudgetHandler as addNewMonthlyBudget };
