const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRole = require('../middlewares/verifyRole');
const actionsController = require('../controllers/transactionsController');

/**
 * @swagger
 * /action/new:
 *   post:
 *     summary: Add a new transaction
 *     description: This endpoint allows adding a new transaction to the database for a user and their household.
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
 *                 description: Type of the transaction (must be 'income' or 'expense').
 *                 example: expense
 *               value:
 *                 type: string
 *                 description: Value of the transaction.
 *                 example: 5000
 *               catId:
 *                 type: string
 *                 description: ID of the transaction category
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       201:
 *         description: Transaction added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response.
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: Message about the successful operation.
 *                   example: Transakcja dodana poprawnie.
 *                 transactionId:
 *                   type: string
 *                   description: Unique identifier of the added transaction.
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response.
 *                   example: nodata
 *                 message:
 *                   type: string
 *                   description: Error description.
 *                   example: Nieprawidłowe dane wejściowe. Sprawdź typ i wartość.
 *       403:
 *         description: User does not belong to any household.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: Error description.
 *                   example: Użytkownik 123 nie należy do żadnego gospodarstwa.
 *       500:
 *         description: Internal server error during transaction processing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: Error description.
 *                   example: Wystąpił błąd podczas dodawania transakcji. Spróbuj ponownie.
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
 *                   example: success
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
 *                         example: 123e4567-e89b-12d3-a456-426614174000
 *                       userId:
 *                         type: string
 *                         description: ID użytkownika, który dodał transakcję
 *                         example: 123e4567-e89b-12d3-a456-426614174000
 *                       houseId:
 *                         type: string
 *                         description: Identyfikator gospodarstwa, którego dotyczy transakcja
 *                         example: 456e7890-b12c-34f5-d678-526314184001
 *                       catId:
 *                         type: string
 *                         description: ID of transaction category
 *                         example: 456e7890-b12c-34f5-d678-526314184001
 *                       type:
 *                         type: string
 *                         description: Typ transakcji
 *                         example: cost
 *                       value:
 *                         type: string
 *                         description: Wartość danej transakcji
 *                         example: 200
 *                       addedAt:
 *                         type: datetime
 *                         description: date and time of adding transaction
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
 *                   example: error
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
 *                   example: error
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
 *     description: Zwraca listę wszystkich transakcji dotyczących gospodarstwa w bazie danych, uporządkowaną według ID transakcji.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: ID użytkownika, dla którego pobierane są transakcje.
 *         required: true
 *         schema:
 *           type: string
 *           example: '123e4567-e89b-12d3-a456-426614174000'
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
 *                   example: 'Transakcje dla gospodarstwa pobrane poprawnie.'
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
 *                       houseId:
 *                         type: string
 *                         description: Identyfikator gospodarstwa, którego dotyczy transakcja
 *                         example: '456e7890-b12c-34f5-d678-526314184001'
 *                       catId:
 *                         type: string
 *                         description: ID kategorii danej transakcji.
 *                         example: '456e7890-b12c-34f5-d678-526314184001'
 *                       type:
 *                         type: string
 *                         description: Typ transakcji
 *                         example: 'cost'
 *                       value:
 *                         type: string
 *                         description: Wartość danej transakcji
 *                         example: '200'
 *                       addedAt:
 *                         type: datetime
 *                         description: Data i godzina dodawania transakcji
 *                         example: 2025-01-01 15:30:01
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
 *                   example: 'Brak transakcji dla gospodarstwa.'
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
 *                   example: 'Błąd podczas pobierania transakcji dla gospodarstwa.'
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
 *         description: Transakcja usunięta pomyślnie.
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
 *                   example: 'Transakcja 123e4567-e89b-12d3-a456-426614174000 usunięta.'
 *       400:
 *         description: Brak wymaganych danych do usunięcia transakcji.
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
 *                   example: 'Brak ID transakcji, którą chcesz usunąć.'
 *       404:
 *         description: Transakcja nie została znaleziona.
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
 *                   example: 'Nie znaleziono transakcji.'
 *       500:
 *         description: Błąd serwera.
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
 *                   example: 'Nie udało się usunąć transakcji.'
 */

router.delete('/', verifyJWT(), verifyRole('mates'), actionsController.deleteAction);

module.exports = router;