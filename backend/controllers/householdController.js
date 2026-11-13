import jwtCookieOptions from '../configs/jwtCookieOptions.js';
import { runController } from '../utils/http/runController.js';
import { AppError } from '../utils/errors/AppError.js';
import { addNewHouse as addNewHouseService } from '../services/household/addNewHouse.js';
import { getHousesCollection } from '../services/household/getHousesCollection.js';
import { getHouseInfo as getHouseInfoService } from '../services/household/getHouseinfo.js';
import { deleteHouse as deleteHouseService } from '../services/household/deleteHouse.js';

export async function addNewHouse(req, res) {
  const userId = req.userId;
  const userName = req.userName;
  const { houseName, initBudget = null } = req.body;

  return runController(res, async () => {
    if (!userId || !houseName) {
      throw new AppError({
        code: 'HOUSE_CTRL_INPUT',
        messageKey: 'Enter every required value.',
        httpStatus: 400,
      });
    }
    const result = await addNewHouseService(userId, userName, houseName, initBudget);
    const { token, ...publicData } = result;
    res.cookie('SESSID', token, { ...jwtCookieOptions, maxAge: 86400000 });
    return publicData;
  });
}

export async function getAllHouses(req, res) {
  return runController(res, () => getHousesCollection());
}

export async function getHouseInfo(req, res) {
  return runController(res, () => getHouseInfoService(req.userId));
}

export async function deleteHouse(req, res) {
  const userId = req.userId;
  const { houseName } = req.body;

  return runController(res, async () => {
    if (!userId || !houseName) {
      throw new AppError({
        code: 'HOUSE_CTRL_DELETE_INPUT',
        messageKey: 'Enter required data.',
        httpStatus: 400,
      });
    }
    const result = await deleteHouseService(userId, req.userName, houseName);
    const { token, ...publicData } = result;
    res.cookie('SESSID', token, { ...jwtCookieOptions, maxAge: 86400000 });
    return publicData;
  });
}
