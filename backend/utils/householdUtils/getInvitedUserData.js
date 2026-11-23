import { findHouseholdUserByUserName } from '../../database/users.js';

export const invitedUserData = async (userName) => {
  return findHouseholdUserByUserName(userName);
};
