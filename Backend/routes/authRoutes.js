const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyJWT = require('../middlewares/verifyJWT');


/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Rejestracja nowego użytkownika
 *     description: Tworzy nowe konto użytkownika na podstawie przesłanych danych rejestracyjnych.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reg_username
 *               - reg_email
 *               - reg_password
 *               - role
 *             properties:
 *               reg_username:
 *                 type: string
 *                 description: Nazwa użytkownika.
 *               reg_email:
 *                 type: string
 *                 description: Adres e-mail użytkownika.
 *               reg_password:
 *                 type: string
 *                 description: Hasło użytkownika.
 *               role:
 *                 type: string
 *                 enum: [superadmin, user]
 *                 description: Rola użytkownika (superadmin lub user).
 *     responses:
 *       200:
 *         description: Użytkownik został pomyślnie zarejestrowany.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Nieprawidłowe dane wejściowe lub konflikt rejestracji.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Wewnętrzny błąd serwera.
 */

router.post('/signup', authController.registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logowanie użytkownika
 *     description: Loguje użytkownika na podstawie adresu e-mail i hasła.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Adres e-mail użytkownika.
 *               password:
 *                 type: string
 *                 description: Hasło użytkownika.
 *     responses:
 *       200:
 *         description: Logowanie zakończone pomyślnie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 userName:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Nieprawidłowe dane wejściowe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Błędne dane logowania.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Wewnętrzny błąd serwera.
 */

router.post('/login', authController.loginUser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Wylogowanie użytkownika
 *     description: Usuwa ciasteczko sesji i wylogowuje użytkownika.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Wylogowano pomyślnie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 */

router.post('/logout', verifyJWT(), authController.logoutUser);

/**
 * @swagger
 * /verify:
 *   get:
 *     summary: Utrzymanie sesji użytkownika
 *     description: Weryfikuje token JWT i zwraca informacje o zalogowanym użytkowniku, takie jak ID, nazwę i rolę.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Zwraca szczegóły zalogowanego użytkownika.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "c1b45d34-3cfa-4f92-8d4b-023adf74c9e3"
 *                   description: Unikalny identyfikator użytkownika.
 *                 userName:
 *                   type: string
 *                   example: "janek"
 *                   description: Nazwa użytkownika.
 *                 role:
 *                   type: string
 *                   example: "user"
 *                   description: Rola użytkownika w systemie (np. "user" lub "superadmin").
 *       401:
 *         description: Brak ważnego tokenu JWT lub token jest nieprawidłowy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Nieprawidłowy token uwierzytelniający."
 *       500:
 *         description: Wewnętrzny błąd serwera.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Błąd serwera."
 */


router.get('/verify', verifyJWT(), (req, res) => {
    res.status(200).json({
        status: 'success',
        userId: req.userId,
        userName: req.userName,
        role: req.role,
    });
});

module.exports = router;