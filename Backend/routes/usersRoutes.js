const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController.js');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRole = require('../middlewares/verifyRole.js');


/**
 * @swagger
 * /users/collection:
 *   get:
 *     summary: Pobierz wszystkich użytkowników aplikacji.
 *     description: Zwraca listę wszystkich użytkowników w bazie danych uporządkowaną według ID użytkownika.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Lista wszystkich użytkowników pobrana poprawnie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   description: Wiadomość o sukcesie
 *                   example: 'Lista wszystkich użytkowników pobrana poprawnie.'
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unikalny identyfikator użytkownika
 *                         example: '123e4567-e89b-12d3-a456-426614174000'
 *                       role:
 *                         type: string
 *                         description: Rola użytkownika w systemie
 *                         example: 'user'
 *                       name:
 *                         type: string
 *                         description: Login użytkownika w systemie
 *                         example: 'test1234'
 *                       password:
 *                         type: string
 *                         description: Zaszyfrowane hasło użytkownika
 *                         example: '$2b$10$Wbc/LzFDGB0quWuk6Fd2CusUdnUHrj9wDa7H4PkU1b4'
 *                       email:
 *                         type: string
 *                         description: Adres e-mail użytkownika.
 *                         example: 'email@email.pl'
 *                       household_id:
 *                         type: string
 *                         description: ID gospodarstwa domowego, którego użytkownik jest założycielem/właścicielem
 *                         example: '42bfc32f-0bd2-4aff-9ebd-6da002ea790e'
 *                       inhabitant:
 *                         type: string
 *                         description: ID gospodarstwa, do którego należy użytkownik, jeśli jest tylko domownikiem.
 *                         example: '42bfc32f-0bd2-4aff-9ebd-6da002ea790e'
 *       500:
 *         description: Błąd serwera.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   description: Opis błędu
 *                   example: 'Błąd pobierania listy użytkowników.'
 */

router.get('/collection', verifyJWT, verifyRole('superadmin'), usersController.getAllUsers);

/**
 * @swagger
 * /users/delete/{userId}:
 *   post:
 *     summary: Usuń użytkownika
 *     description: Usuwa użytkownika z systemu. Jeśli użytkownik jest właścicielem gospodarstwa, gospodarstwo i wszelkie informacje o nim również zostaną usunięte. Rola domowników zmieni się na 'user'
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID użytkownika do usunięcia.
 *         schema:
 *           type: string
 *           example: '123e4567-e89b-12d3-a456-426614174000'
 *     requestBody:
 *       description: Brak dodatkowych danych w ciele żądania.
 *       required: false
 *     responses:
 *       200:
 *         description: Użytkownik usunięty pomyślnie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: Wiadomość o sukcesie.
 *                   example: Użytkownik usunięty poprawnie.
 *       403:
 *         description: Brak uprawnień do usunięcia użytkownika.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: Opis błędu.
 *                   example: Nie masz uprawnień do usunięcia użytkownika.
 *       404:
 *         description: Użytkownik nie został znaleziony.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: Opis błędu.
 *                   example: Nie znaleziono użytkownika.
 *       500:
 *         description: Wystąpił błąd serwera podczas usuwania użytkownika.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: Opis błędu.
 *                   example: Błąd podczas usuwania użytkownika.
 */

router.post('/delete/:userId', verifyJWT, verifyRole('superadmin'), usersController.deleteUser);

/**
 * @swagger
 * /users/delete/inhabitant:
 *   delete:
 *     summary: Usuń domownika
 *     description: Usuwa domownika z gospodarstwa, jeśli użytkownik posiada odpowiednie uprawnienia. Rola domownika w systemie zmienia się na 'user'
 *     tags:
 *       - Inhabitants
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inhabitantId:
 *                 type: string
 *                 description: ID domownika do usunięcia.
 *                 example: '456e4567-e89b-12d3-a456-426614174000'
 *     responses:
 *       200:
 *         description: Domownik został pomyślnie usunięty.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   description: Wiadomość o sukcesie.
 *                   example: 'Domownik 456e4567-e89b-12d3-a456-426614174000 został usunięty poprawnie.'
 *       400:
 *         description: Złe żądanie (np. brak uprawnień lub błędne dane).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   description: Opis błędu.
 *                   example: 'Nie masz uprawnień do usunięcia tego użytkownika.'
 *       404:
 *         description: Nie znaleziono domownika do usunięcia.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   description: Opis błędu.
 *                   example: 'Domownik o podanym ID nie istnieje.'
 *       500:
 *         description: Wystąpił błąd serwera podczas usuwania domownika.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   description: Opis błędu.
 *                   example: 'Nie udało się usunąć domownika.'
 */

router.delete('/delete/:inhabitant', verifyJWT, verifyRole('host'), usersController.deleteInhabitant);

/**
 * @swagger
 * /users/invite:
 *   post:
 *     summary: Dodaj użytkownika do gospodarstwa
 *     description: Dodaje użytkownika do gospodarstwa, jeśli spełnia odpowiednie warunki (np. nie jest już domownikiem lub gospodarzem).
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: Nazwa użytkownika, który ma zostać dodany do gospodarstwa.
 *                 example: "john_doe"
 *     responses:
 *       200:
 *         description: Użytkownik pomyślnie dodany do gospodarstwa.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   description: Wiadomość o sukcesie.
 *                   example: 'Użytkownik john_doe został dodany do gospodarstwa.'
 *       400:
 *         description: Użytkownik już należy do gospodarstwa lub wystąpił inny błąd.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   description: Opis błędu.
 *                   example: 'Użytkownik jest już domownikiem.'
 *       404:
 *         description: Nie znaleziono gospodarstwa lub użytkownika.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   description: Opis błędu.
 *                   example: 'Nie znaleziono gospodarstwa dla tego użytkownika.'
 *       500:
 *         description: Wystąpił błąd serwera podczas przetwarzania żądania.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status odpowiedzi.
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   description: Opis błędu.
 *                   example: 'Błąd przetwarzania żądania.'
 */

router.post('/invite', verifyJWT, verifyRole('host'), usersController.addUserToHouse);

// router.post('/invite/perm');

router.post('/changemail', verifyJWT, usersController.changeEmail);

module.exports = router;