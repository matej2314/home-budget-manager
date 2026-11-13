import { runController } from '../utils/http/runController.js';
import { getBoardData } from '../services/board/getBoardData.js';

export async function getBoardDataHandler(req, res) {
  const userId = req.userId;
  const filter = req.params.filter;
  const page = req.params.page;
  return runController(res, () => getBoardData(userId, filter, page));
}

export { getBoardDataHandler as getBoardData };
