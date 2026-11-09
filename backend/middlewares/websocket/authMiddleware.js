import cookieParser from 'cookie';
import jwt from 'jsonwebtoken';
import logger from '../../configs/logger.js';

const JWT_SECRET = process.env.JWT_SECRET;


const authMiddleware = (socket, next) => {
	try {
		const cookies = socket.request.headers.cookie || '';
		const parsedCookies = cookieParser.parse(cookies);
		const token = parsedCookies.SESSID;

		if (!token) {
			return next(new Error('Brak danych uwierzytelniających.'));
		}

		jwt.verify(token, JWT_SECRET, (err, decoded) => {
			if (err) {
				return next(new Error('Nieprawidłowy lub wygasły token dostępu.'));
			}

			socket.user = { id: decoded.id };
			next();
		});
	} catch (error) {
		logger.error(`Błąd w authMiddleware : ${error.message}`);
		next(new Error('Błąd uwierzytelniania.'));
	}
};

export default authMiddleware;
