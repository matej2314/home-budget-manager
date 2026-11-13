import { runController } from '../utils/http/runController.js';
import { addActionCat } from '../services/categories/addActionCat.js';
import { getActionCatColl } from '../services/categories/actionCatCollection.js';
import { deleteActionCat as deleteActionCatService } from '../services/categories/deleteActionCat.js';

export async function addNewActionCat(req, res) {
  const { name, type } = req.body;
  return runController(res, () => addActionCat(name, type));
}

export async function actionCatCollection(req, res) {
  return runController(res, () => getActionCatColl());
}

export async function deleteActionCat(req, res) {
  const { catName, catId } = req.body;
  return runController(res, () => deleteActionCatService(catName, catId));
}
