const pool = require('../database/db');
const logger = require('../configs/logger');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const jwtCookieOptions = require('../configs/jwtCookieOptions');
const { registerValidations, loginValidations } = require('../utils/validation');
const { checkUserEmail } = require('../utils/checkUtils/checkUserEmail');
const queries = require('../database/authQueries');
const socketQueries = require('../database/websocketQueries');
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

exports.registerUser = async (req, res) => {
	const { reg_username, reg_email, reg_password, role, cookies } = req.body;

	const validations = registerValidations(reg_username, reg_email, reg_password, role)

	const connection = await pool.getConnection();

	try {
		const checkEmail = await checkUserEmail(connection, reg_email);

		if (checkEmail && checkEmail.email === reg_email) {
			return res.status(statusCode.CONFLICT).json({
				status: 'error',
				message: 'Użytkownik o takim adresie e-mail istnieje.'
			});
		}
		for (const validation of validations) {
			if (!validation.isValid) {
				logger.error(validation.message);
				return res.status(statusCode.BAD_REQUEST).json({
					status: 'error',
					message: validation.message
				});
			}
		}

		if (role === 'superadmin') {
			const [rows] = await connection.query(queries.registerAdminCheck);
			if (rows.length > 0) {
				return res.status(statusCode.BAD_REQUEST).json({
					status: 'error',
					message: 'Konto superadmina już istnieje'
				});
			}
		}

		const hashedPassword = await bcrypt.hash(reg_password, 10);
		const userId = uuidv4();

		const [result] = await connection.query(queries.register, {
			id: userId,
			role,
			name: reg_username,
			password: hashedPassword,
			email: reg_email,
			acceptCookies: cookies ? cookies : 0,
		});

		if (result.affectedRows === 1) {
			await connection.query(queries.houseUsers, {
				id: uuidv4(),
				userId: userId,
				userName: reg_username,
				houseId: 0,
				role: role,
			});
		}

		const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '1h' });

		res.cookie('SESSID', token, {
			...jwtCookieOptions,
			maxAge: 60 * 60 * 1000,
		});

		return res.status(statusCode.OK).json({
			status: 'success',
			message: 'Użytkownik zarejestrowany. Możesz się zalogować'
		});
	} catch (error) {
		logger.error('Błąd podczas rejestracji użytkownika: ', error);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
			status: 'error',
			message: 'Błąd serwera.'
		});
	} finally {
		connection.release();
	}
};

exports.loginUser = async (req, res) => {
	const { email, password } = req.body;
	const connection = await pool.getConnection();

	const validations = loginValidations(email, password);

	for (const validation of validations) {
		if (!validation.isValid) {
			logger.error(validation.message);
			return res.status(statusCode.BAD_REQUEST).json({
				status: 'error',
				message: validation.message
			});
		}
	}

	try {
		const [rows] = await connection.query(queries.login, [email]);

		if (rows.length === 0) {
			logger.error('Nieprawidłowy adres e-mail.');
			return res.status(statusCode.UNAUTHORIZED).json({
				status: 'error',
				message: 'Nieprawidłowe dane logowania.'
			});
		}

		const user = rows[0];
		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			logger.error('Nieprawidłowe hasło.');
			return res.status(statusCode.UNAUTHORIZED).json({
				status: 'error',
				message: 'Nieprawidłowe dane logowania.'
			});
		}

		const token = jwt.sign({ id: user.id, role: user.role, userName: user.name }, JWT_SECRET, { expiresIn: '24h' });

		res.cookie('SESSID', token, {
			...jwtCookieOptions,
			maxAge: 86400000,
		});

		logger.info(`Użytkownik ${user.name} zalogowany pomyślnie.`);

		return res.status(statusCode.OK).json({
			status: 'success',
			message: 'Użytkownik zalogowany pomyślnie.',
			userName: user.name,
			role: user.role,
			id: user.id,
			cookies: user.acceptCookies,
			tour: user.completeTour,
			avatar: user.avatarName,
		});
	} catch (error) {
		logger.error(`Błąd podczas logowania użytkownika: ${error.message}`);
		return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
			status: 'error',
			message: 'Błąd serwera.'
		});
	} finally {
		connection.release();
	}
};

exports.logoutUser = async (req, res) => {

	await pool.query(socketQueries.deleteConnection, [req.userId]);

	res.clearCookie('SESSID', {
		httpOnly: true,
		secure: false,
		sameSite: 'lax',
	});
	res.status(statusCode.OK).json({ status: 'success', message: 'Wylogowano pomyślnie.' });
};
