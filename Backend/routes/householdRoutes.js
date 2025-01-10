const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../database/db');
const logger = require('../configs/logger');
const { v4: uuidv4 } = require('uuid');
const verifyJWT = require('../middlewares/verifyJWT.js');
const JWT_SECRET = process.env.JWT_SECRET;
const jwtCookieOptions = require('../configs/jwtCookieOptions.js');
const householdController = require('../controllers/householdController.js');

/**
 * @swagger
 * /house/new:
 *   post:
 *     summary: Creating new household
 *     description: This endpoint allows to create new household in db.
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
 *                 description: Name of household
 *                 example: My Flat
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
 *                   example: Podaj wszystkie niezbędne informacje
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
 *                    example: Błąd podczas sprawdzania gospodarstwa
 *                    
 * 
 */

router.post('/new', verifyJWT(), householdController.addNewHouse);

/**
 * @swagger
 * /house/all:
 *   get:
 *     summary: Pobierz wszystkie gospodarstwa
 *     description: Zwraca listę wszystkich gospodarstw w systemie, uporządkowaną według identyfikatora gospodarstwa.
 *     tags:
 *       - Households
 *     responses:
 *       200:
 *         description: Lista gospodarstw pobrana pomyślnie
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
 *                   example: Gospodarstwa pobrane poprawnie
 *                 houses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       houseId:
 *                         type: string
 *                         description: Unikalny identyfikator gospodarstwa
 *                         example: '123e4567-e89b-12d3-a456-426614174000'
 *                       houseName:
 *                         type: string
 *                         description: Nazwa gospodarstwa
 *                         example: My Flat
 *                       ownerId:
 *                         type: string
 *                         description: Identyfikator właściciela gospodarstwa
 *                         example: '456e7890-b12c-34f5-d678-526314184001'
 *       404:
 *         description: Brak gospodarstw
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
 *                   example: Brak gospodarstw.
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
 *                   example: Błąd podczas pobierania gospodarstw.
 */

router.get('/all', verifyJWT(), householdController.getAllHouses);

/**
 * @swagger
 * /house/info:
 *   get:
 *     summary: Pobierz informacje o gospodarstwie
 *     description: Zwraca wszystkie informacje dotyczące wskazanego gospodarstwa domowego.
 *     tags:
 *       - Households
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
 *                   description: Status odpowiedzi
 *                   example: 'success'
 *                 message:
 *                   type: string
 *                   description: Wiadomość o sukcesie
 *                   example: Informacje o gospodarstwie pobrane poprawnie
 *                 info:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       houseId:
 *                         type: string
 *                         description: Unikalny identyfikator gospodarstwa
 *                         example: '123e4567-e89b-12d3-a456-426614174000'
 *                       houseName:
 *                         type: string
 *                         description: Nazwa gospodarstwa
 *                         example: My Flat
 *                       ownerId:
 *                         type: string
 *                         description: Identyfikator właściciela gospodarstwa
 *                         example: '456e7890-b12c-34f5-d678-526314184001'
 *                       initBudget:
 *                         type: number
 *                         description: Wartość budżetu początkowego.
 *                         example: 20500
 *                       balance:
 *                         type: number
 *                         description: Ostatnia wartość bilansu gospodarstwa.
 *                         example: +2500
 *                       last_balance:
 *                         type: date
 *                         description: Data dokonania ostatniego bilansowania.
 *                         example: 2025-05-20
 *                         
 *       404:
 *         description: Brak gospodarstw
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
 *                   example: Brak gospodarstw.
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
 *                   example: Nie udało się pobrać danych o gospodarstwie.
 */

router.get('/info', verifyJWT(), householdController.getHouseInfo);

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

router.delete('/delete', verifyJWT(), householdController.deleteHouse);


module.exports = router;