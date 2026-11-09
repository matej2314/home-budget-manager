const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

const verifyJWT = (req, res, next) => {

    const token = req.cookies.SESSID;

    if (!token) return res.status(statusCode.UNAUTHORIZED).json({
        status: 'error',
        message: 'Zaloguj się, aby zobaczyć zasoby.'
    });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.role = decoded.role;
        req.userName = decoded.userName;
        req.avatar = decoded.avatar;
        next();
    } catch (error) {
        return res.status(statusCode.UNAUTHORIZED).json({
            status: 'error',
            message: 'Zaloguj się, aby zobaczyć zasoby.'
        });
    };
};

module.exports = verifyJWT;