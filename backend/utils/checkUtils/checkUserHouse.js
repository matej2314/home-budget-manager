import { findHouseholdUserRow } from '../../database/households.js';

const checkUserHouse = async (userId) => {
  return findHouseholdUserRow(userId);
};

export default checkUserHouse;
