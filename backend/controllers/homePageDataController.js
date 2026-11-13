import { runController } from '../utils/http/runController.js';
import { AppError } from '../utils/errors/AppError.js';
import { getHomePageCollection } from '../services/shell/homepage/homePageDataCollection.js';
import { addTechnologyContent } from '../services/shell/homepage/addTechnologyService.js';

export async function getDataCollection(req, res) {
  return runController(res, () => getHomePageCollection());
}

export async function addTechnology(req, res) {
  const { name, icon } = req.body;
  return runController(res, async () => {
    if (!name || !icon) {
      throw new AppError({
        code: 'SHELL_HP_CTRL_INPUT',
        messageKey: 'Enter technology details!',
        httpStatus: 400,
      });
    }
    return addTechnologyContent(name, icon);
  });
}
