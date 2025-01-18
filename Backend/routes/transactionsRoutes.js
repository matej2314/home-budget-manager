const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRole = require('../middlewares/verifyRole');
const actionsController = require('../controllers/transactionsController');

/**
 * @swagger
 * /action/new:
 *   post:
 *     summary: Adding new transaction
 *     description: This endpoint allows to add new transaction to db.
 *     tags:
 *       - Transactions
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: type of transaction
 *                 example: cost
 *               value:
 *                 type: string
 *                 description: Value of transaction
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Household created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   description: Message about response.
 *                   example: Gospodarstwo My Flat dodane poprawnie.
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                    type: string
 *                    description: status of the response
 *                    example: 'error'
 *                 message:
 *                   type: string
 *                   description: Error description
 *                   example: Prześlij poprawne dane
 *       500:
 *         description: Błąd wewnętrzny serwera
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                    type: string
 *                    description: Status of the response
 *                    example: 'error'
 *                 message:
 *                    type: string
 *                    description: Description of error
 *                    example: Nie udało się dodać transakcji
 *                    
 * 
 */

router.post('/new', verifyJWT(), verifyRole('mates'), actionsController.addNewAction);

/**
 * @swagger
 * /action/collection:
 *   get:
 *     summary: Pobierz wszystkie transakcje
 *     description: Zwraca listę wszystkich transakcji w bazie danych uporządkowaną według ID transakcji.
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: Transakcje pobrane poprawnie.
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
 *                   example: Transakcje pobrane poprawnie
 *                 actions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       transactionId:
 *                         type: string
 *                         description: Unikalny identyfikator transakcji
 *                         example: '123e4567-e89b-12d3-a456-426614174000'
 *                       userId:
 *                         type: string
 *                         description: ID użytkownika, który dodał transakcję
 *                         example: '123e4567-e89b-12d3-a456-426614174000'
 *                       householdId:
 *                         type: string
 *                         description: Identyfikator gospodarstwa, którego dotyczy transakcja.
 *                         example: '456e7890-b12c-34f5-d678-526314184001'
 *                       type:
 *                         type: string
 *                         description: Typ transakcji
 *                         example: 'cost'
 *                       value:
 *                         type: string
 *                         description: Wartość danej transakcji.
 *                         example: '200'
 *       404:
 *         description: Brak transakcji.
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
 *                   description: Wiadomość o braku danych
 *                   example: Brak transakcji.
 *       500:
 *         description: Błąd serwera
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
 *                   example: Błąd podczas pobierania transakcji.
 */

router.get('/collection', verifyRole('superadmin'), actionsController.getAllActions);

/**
 * @swagger
 * /action/my:
 *   get:
 *     summary: Pobierz transakcje dot. wskazanego gospodarstwa
 *     description: Zwraca listę wszystkich transakcji dot. gospodarstwa w bazie danych uporządkowaną według ID transakcji
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: Transakcje dla gospodarstwa pobrane poprawnie.
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
 *                   example: Transakcje dla gospodarstwa pobrane poprawnie
 *                 actions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       transactionId:
 *                         type: string
 *                         description: Unikalny identyfikator transakcji
 *                         example: '123e4567-e89b-12d3-a456-426614174000'
 *                       userId:
 *                         type: string
 *                         description: ID użytkownika, który dodał transakcję
 *                         example: '123e4567-e89b-12d3-a456-426614174000'
 *                       householdId:
 *                         type: string
 *                         description: Identyfikator gospodarstwa, którego dotyczy transakcja.
 *                         example: '456e7890-b12c-34f5-d678-526314184001'
 *                       type:
 *                         type: string
 *                         description: Typ transakcji
 *                         example: 'cost'
 *                       value:
 *                         type: string
 *                         description: Wartość danej transakcji.
 *                         example: '200'
 *       404:
 *         description: Brak transakcji dla gospodarstwa.
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
 *                   description: Wiadomość o braku danych
 *                   example: Brak transakcji dla gospodarstwa.
 *       500:
 *         description: Błąd serwera
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
 *                   example: Błąd podczas pobierania transakcji dla gospodarstwa.
 */

router.get('/my', verifyJWT(), verifyRole('mates'), actionsController.getHouseActions);

/**
 * @swagger
 * /actions:
 *   delete:
 *     summary: Usuń wybraną transakcję
 *     description: Usuwa transakcję, jeśli użytkownik jest właścicielem lub domownikiem i podał wszystkie wymagane dane.
 *     tags:
 *       - Transactions
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: string
 *                 description: ID transakcji przeznaczonej do usunięcia.
 *                 example: '123e4567-e89b-12d3-a456-426614174000'
 *     responses:
 *       200:
 *         description: Transakcja usunięta pomyślnie
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
 *                   example: Transakcja '123e4567-e89b-12d3-a456-426614174000' usunięta.
 *       400:
 *         description: Brak wymaganych danych do usunięcia gospodarstwa
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
 *                   example: Brak ID transakcji, którą chcesz usunąć.
 *       404:
 *         description: Gospodarstwo nie zostało znalezione
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
 *                   example: Nie znaleziono transakcji.
 *       500:
 *         description: Błąd serwera
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
 *                   example: Nie udało się usunąć transakcji.
 */

router.delete('/', verifyJWT(), verifyRole('mates'), actionsController.deleteAction);

module.exports = router;