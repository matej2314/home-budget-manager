import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { VerifyTokenRequest, DecodedToken } from '@types/verifyToken';
import { StatusCodes } from 'http-status-codes';
const statusCode = StatusCodes;
const JWT_SECRET: string = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

const verifyJWT = (req: VerifyTokenRequest, res: Response, next: NextFunction) => {
    const token: string = req.cookies.SESSID;

    if (!token) {
        return res.status(statusCode.UNAUTHORIZED).json({
            status: 'error',
            message: 'Zaloguj się, aby zobaczyć zasoby',
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as unknown;
        const decodedToken = decoded as DecodedToken;

        req.userId = decodedToken.id;
        req.role = decodedToken.role;
        req.userName = decodedToken.userName;
        req.avatar = decodedToken.avatar;
        next();
    } catch (error) {
        res.status(statusCode.UNAUTHORIZED).json({
            status: 'error',
            message: 'Zaloguj się, aby zobaczyć zasoby'
        });
    };
};

module.exports = verifyJWT;