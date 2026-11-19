import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

const JWT_SECRET = process.env.JWT_SECRET;
const statusCode = StatusCodes;

const sessionRequired = {
  status: 'error',
  message: 'auth.sessionRequired',
};

const verifyJWT = (req, res, next) => {
  const token = req.cookies.SESSID;

  if (!token) return res.status(statusCode.UNAUTHORIZED).json(sessionRequired);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;
    req.userName = decoded.userName;
    req.avatar = decoded.avatar;
    next();
  } catch {
    return res.status(statusCode.UNAUTHORIZED).json(sessionRequired);
  }
};

export default verifyJWT;
