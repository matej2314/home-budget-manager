import logger from '../../configs/logger.js';
import {
  setUserHostFlags,
  setUserInmateFlags,
  updateHouseholdUserHouseId,
  updateHouseholdUserRole,
} from '../../database/users.js';

export const resetHostProps = async (userId) => {
  await setUserHostFlags(userId, { host: false, role: 'user' });
  await updateHouseholdUserRole(userId, 'user');
  await updateHouseholdUserHouseId(userId, null);
  logger.info(`Parameters of user ${userId} reseted.`);
};

export const resetInmatesProps = async (userId) => {
  await setUserInmateFlags(userId, { inmate: false, role: 'user' });
  await updateHouseholdUserRole(userId, 'user');
  await updateHouseholdUserHouseId(userId, null);
  logger.info(`Parameters of inmates deleted.`);
};

export const setHostProps = async (userId, houseId) => {
  await updateHouseholdUserRole(userId, 'host');
  await updateHouseholdUserHouseId(userId, houseId);
  logger.info(`Parameters of host ${userId} set.`);
};

export const setInmateProps = async (userId, existingId) => {
  await updateHouseholdUserRole(userId, 'inmate');
  await updateHouseholdUserHouseId(userId, existingId);
  logger.info(`Parameters of inmates of household ${existingId} set.`);
};
