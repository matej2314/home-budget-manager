const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT.js');
const verifyRole = require('../middlewares/verifyRole.js');
const householdController = require('../controllers/householdController.js');

/**
 * @swagger
 * /house/new:
 *   post:
 *     summary: Create a new household
 *     description: This endpoint allows a user to create a new household in the database. A valid user ID and household name are required.
 *     tags:
 *       - Households
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               houseName:
 *                 type: string
 *                 description: Name of the household
 *                 example: My Flat
 *               initBudget:
 *                 type: number
 *                 description: Initial budget for the household (optional)
 *                 example: 500.00
 *     responses:
 *       200:
 *         description: Household created successfully, user token updated.
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
 *                   description: Confirmation message
 *                   example: Gospodarstwo My Flat dodane poprawnie.
 *                 token:
 *                   type: string
 *                   description: Updated JWT token for the user
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 newRole:
 *                   type: string
 *                   description: New role assigned to the user
 *                   example: owner
 *       400:
 *         description: Missing or invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Podaj wszystkie niezbędne informacje.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response
 *                   example: 'error'
 *                 message:
 *                   type: string
 *                   description: Error description
 *                   example: Wystąpił błąd podczas dodawania nowego gospodarstwa.
 */

router.post('/new', verifyJWT(), verifyRole('user'), householdController.addNewHouse);

/**
 * @swagger
 * /house/collection:
 *   get:
 *     summary: Pobierz wszystkie gospodarstwa
 *     description: Zwraca listę wszystkich gospodarstw w systemie. Gospodarstwa są uporządkowane według identyfikatora gospodarstwa.
 *     tags:
 *       - Households
 *     responses:
 *       200:
 *         description: Lista gospodarstw pobrana pomyślnie.
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
 *                   example: Gospodarstwa pobrane poprawnie.
 *                 houses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       houseId:
 *                         type: string
 *                         description: Unikalny identyfikator gospodarstwa.
 *                         example: '123e4567-e89b-12d3-a456-426614174000'
 *                       userId:
 *                         type: string
 *                         description: Identyfikator właściciela gospodarstwa.
 *                         example: '456e7890-b12c-34f5-d678-526314184001'
 *                       houseName:
 *                         type: string
 *                         description: Nazwa gospodarstwa.
 *                         example: My Flat
 *                       initBudget:
 *                         type: string
 *                         description: Początkowy budżet gospodarstwa
 *                         example: 5000
 *                       balance: 
 *                         type: string
 *                         description: Kwota ostatniego bilansu gospodarstwa
 *                         example: 15800
 *                       balanceDate:
 *                         type: date
 *                         description: Data wykonania ostatniego bilansu
 *                         example: 2025-01-01
 *                       createdAt:
 *                         type: datetime
 *                         description: Data utworzenia gospodarstwa.
 *                         example: 2025-01-01 13:25:01                       
 *       404:
 *         description: Brak gospodarstw w systemie.
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
 *                   description: Wiadomość o braku danych.
 *                   example: Brak gospodarstw.
 *       500:
 *         description: Wewnętrzny błąd serwera.
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
 *                   example: Wystąpił błąd podczas przetwarzania żądania.
 */

router.get('/collection', verifyJWT(),verifyRole('superadmin'), householdController.getAllHouses);

/**
 * @swagger
 * /house/info:
 *   get:
 *     summary: Pobierz informacje o gospodarstwie
 *     description: Zwraca wszystkie informacje dotyczące wskazanego gospodarstwa domowego na podstawie identyfikatora użytkownika.
 *     tags:
 *       - Households
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: Identyfikator użytkownika powiązany z gospodarstwem.
 *         schema:
 *           type: string
 *           example: '789e1234-f56b-78d9-a123-456789abcdef'
 *     responses:
 *       200:
 *         description: Informacje o gospodarstwie pobrane poprawnie.
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
 *                   example: Informacje o gospodarstwie pobrane poprawnie
 *                 info:
 *                   type: object
 *                   properties:
 *                     houseId:
 *                       type: string
 *                       description: Unikalny identyfikator gospodarstwa.
 *                       example: '123e4567-e89b-12d3-a456-426614174000'
 *                     houseName:
 *                       type: string
 *                       description: Nazwa gospodarstwa.
 *                       example: My Flat
 *                     userId:
 *                       type: string
 *                       description: Identyfikator właściciela gospodarstwa.
 *                       example: '456e7890-b12c-34f5-d678-526314184001'
 *                     initBudget:
 *                       type: number
 *                       description: Wartość budżetu początkowego.
 *                       example: 20500
 *                     balance:
 *                       type: number
 *                       description: Ostatnia wartość bilansu gospodarstwa.
 *                       example: 2500
 *                     balanceDate:
 *                       type: string
 *                       format: date
 *                       description: Data dokonania ostatniego bilansowania.
 *                       example: 2025-05-20
 *       400:
 *         description: Błędne dane wejściowe lub brak danych o gospodarstwie.
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
 *                   description: Wiadomość o braku danych.
 *                   example: Brak gospodarstwa powiązanego z podanym identyfikatorem użytkownika.
 *       500:
 *         description: Wewnętrzny błąd serwera.
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
 *                   example: Wystąpił błąd przy przetwarzaniu żądania.
 */

router.get('/info', verifyJWT(), verifyRole('mates'), householdController.getHouseInfo);

/**
 * @swagger
 * /house/delete:
 *   delete:
 *     summary: Usuń gospodarstwo
 *     description: Usuwa gospodarstwo, jeśli użytkownik jest właścicielem i podał wszystkie wymagane dane.
 *     tags:
 *       - Households
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               houseName:
 *                 type: string
 *                 description: Nazwa gospodarstwa do usunięcia
 *                 example: Dom przy ulicy Wiśniowej
 *     responses:
 *       200:
 *         description: Gospodarstwo usunięte pomyślnie
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
 *                   example: Gospodarstwo Dom przy ulicy Wiśniowej usunięte.
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
 *                   example: Podaj prawidłowe dane do usunięcia gospodarstwa.
 *       403:
 *         description: Brak uprawnień do usunięcia gospodarstwa
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
 *                   example: Brak uprawnień do usunięcia gospodarstwa.
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
 *                   example: Nie znaleziono gospodarstwa.
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
 *                   example: Nie udało się usunąć gospodarstwa.
 */

router.delete('/delete', verifyJWT(),verifyRole('host'), householdController.deleteHouse);


module.exports = router;