import { findUserByEmail } from '../../database/auth.js';

const checkUserEmail = async (reg_email) => {
  return findUserByEmail(reg_email);
};

export { checkUserEmail };
