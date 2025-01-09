const pool = require('../database/db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const logger = require('../configs/logger');
const { isValidPassword, isValidEmail, isValidUsername } = require('../utils/validation');
const jwtCookieOptions = require('../configs/jwtCookieOptions');
const queries = require('../database/authQueries');

exports.registerUser = async (req, res) => {
    try {
    const { reg_username, reg_email, reg_password, role } = req.body;
        const allowedRoles = ['admin', 'user'];
        
    const validations = [
        { isValid: !!reg_username && isValidUsername(reg_username), message: 'Podaj prawidłowe dane użytkownika.' },
        { isValid: !!reg_email && isValidEmail(reg_email), message: 'Podaj prawidłowe dane użytkownika.' },
        { isValid: !!reg_password && isValidPassword(reg_password), message: 'Podaj prawidłowe dane użytkownika.' },
        { isValid: allowedRoles.includes(role), message: 'Nieprawidłowa rola użytkownika!' },
        ];
        
        for (const validation of validations) {
            if (!validation.isValid) {
                logger.error(validation.message);
                return res.status(400).json({status: 'error', message: validation.message });
            }
        }

        if (role === 'admin') {
            const [rows] = await pool.query(queries.registerAdminCheck);
            if (rows.length > 0) {
                return res.status(400).json({status: 'error', message: 'Konto administratora już istnieje' });
            };
        };

        const hashedPassword = await bcrypt.hash(reg_password, 10);
        const userId = uuidv4();

        try {
            await pool.query(queries.register, {
                id: userId,
                role,
                name: reg_username,
                password: hashedPassword,
                email: reg_email,
            });

            const token = jwt.sign({ id: userId, role, }, JWT_SECRET, { expiresIn: '1h' });

            res.cookie('SESSID', token, {
                ...jwtCookieOptions,
                maxAge: 60 * 60 * 1000,
            });

            return res.status(200).json({ status: 'success', message: 'Użytkownik zarejestrowany. Możesz się zalogować' });
        } catch (error) {
            logger.error('Błąd podczas rejestracji użytkownika', error);
            return res.status(500).json({status: 'error', message: 'Błąd serwera.' });
        }

    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({status: 'error', message: 'Błąd podczas rejestracji użytkownika.' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const validations = [
            { isValid: email && email.trim() !== '', message: 'Podaj prawidłowy adres e-mail.' },
            { isValid: password && password.trim() !== '', message: 'Podaj prawidłowe hasło.' },
        ];

        for (const validation of validations) {
            if (!validation.isValid) {
                logger.error(validation.message);
                return res.status(400).json({ status: 'error', message: validation.message });
            }
        }

        const [rows] = await pool.query(queries.login, [email]);

        if (rows.length === 0) {
            logger.error('Nieprawidłowy adres e-mail.');
            return res.status(401).json({status: 'error', message: 'Nieprawidłowe dane logowania.' });
        }

        const user = rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            logger.error('Nieprawidłowe hasło.');
            return res.status(401).json({status: 'error', message: 'Nieprawidłowe dane logowania.' });
        };
        
        let houseToToken;
        const houseHold = user.household_id !== null ? user.household_id : null;
        const inhabitant = user.inhabitant !== null ? user.inhabitant : null;

        houseToToken = houseHold || inhabitant;

        const token = jwt.sign(
            { Id: user.id, role: user.role, userName: user.name, houseHold: houseToToken },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('SESSID', token, {
            ...jwtCookieOptions,
            maxAge: 86400000, 
        });

        logger.info(`Użytkownik ${user.name} zalogowany pomyślnie.`);

        return res.status(200).json({
            status: 'success',
            message: 'Użytkownik zalogowany pomyślnie.',
            userName: user.name,
            role: user.role,
        });
        
    } catch (error) {
        logger.error(`Błąd podczas logowania użytkownika: ${error.message}`);
        return res.status(500).json({status: 'error', message: 'Błąd serwera.' });
    }
};


exports.logoutUser = async (req, res) => {
    res.clearCookie('SESSID', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    });
    res.status(200).json({status: 'success', message: 'Wylogowano pomyślnie.' });
}