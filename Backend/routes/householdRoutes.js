const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../database/db');
const logger = require('../configs/logger');
const { v4: uuidv4 } = require('uuid');
const verifyJWT = require('../middlewares/verifyJWT.js');
const JWT_SECRET = process.env.JWT_SECRET;
const jwtCookieOptions = require('../configs/jwtCookieOptions.js');

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

router.post('/new', verifyJWT(), async (req, res) => {
    const userId = req.userId;
    const {houseName}  = req.body;

    if (!userId || !houseName) {
        logger.error('Brak danych: userId lub houseName są puste.');
        return res.status(400).json({ status: 'error', message: 'Podaj wszystkie niezbędne informacje.' });
    }

    const houseId = uuidv4();
    const checkQuery = 'SELECT * FROM households WHERE houseName = ?';
    const addQuery = 'INSERT INTO households (houseId, ownerId, houseName) VALUES (?, ?, ?)';
    const mateQuery = 'UPDATE users SET inhabitant=? WHERE id=?';
    let houseToToken = houseId;

    try {
        const [results] = await pool.query(checkQuery, [houseName]);

        if (results.length > 0) {
            const existingHouseId = results[0].houseId;
            try {
                await pool.query(mateQuery, [existingHouseId, userId]);
                logger.info(`Gospodarstwo ${houseName} już istnieje. Dodano domownika.`);
                houseToToken = existingHouseId;
            } catch (error) {
                logger.error(`Błąd podczas dodawania domownika: ${error}`);
                return res.status(500).json({
                    status: 'error',
                    message: 'Nie udało się dodać domownika do istniejącego gospodarstwa.',
                });
            }
        } else if (results.length == 0) {
            await pool.query(addQuery, [houseId, userId, houseName]);
            logger.info(`Gospodarstwo ${houseName} dodane poprawnie.`);
        }
    
        const token = jwt.sign({
            id: userId,
            role: req.role,
            userName: req.userName,
            houseHold: houseToToken,
        }, JWT_SECRET, { expiresIn: '24h' });
    
        res.cookie('SESSID', token, {
            ...jwtCookieOptions,
            maxAge: 86400000,
        });
    
        return res.status(200).json({
            status: 'success',
            message: houseToToken === houseId
                ? `Gospodarstwo ${houseName} dodane poprawnie.`
                : `Gospodarstwo ${houseName} już istnieje. Dodano domownika.`,
            houseId: houseToToken, 
        });
    } catch (error) {
        logger.error(`Błąd podczas przetwarzania żądania: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd podczas przetwarzania żądania.' });
    }
});


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
 *                       owner_id:
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

router.get('/all', verifyJWT(), async (req, res) => {
    const query = 'SELECT houseId, houseName, ownerId FROM households ORDER BY houseId';
    
    try {
        const [result] = await pool.query(query);

        if (result.length === 0) {
            logger.info('Brak gospodarstw.');
            return res.status(404).json({ status: 'error', message: 'Brak gospodarstw.' });
        }

        logger.info('Gospodarstwa pobrane poprawnie');
        return res.status(200).json({
            status: 'success',
            message: 'Gospodarstwa pobrane poprawnie',
            houses: result,
        });
    } catch (error) {
        logger.error(`Błąd podczas pobierania gospodarstw: ${error.stack}`);
        return res.status(500).json({status: 'error', message: 'Błąd podczas pobierania gospodarstw.' });
    }
});


router.get('/info', verifyJWT(), async (req, res) => {
    try {
        const userId = req.userId;
        const householdId = req.house;

        if (!userId || !householdId) {
            logger.error('Brak danych do pobrania informacji o gospodarstwie.');
            return res.status(400).json({status: 'error', message: 'Brak poprawnych informacji.' });
        }

        const dataQuery = 'SELECT * FROM households WHERE houseId=? AND ownerId=?';

        try {
            const [result] = await pool.query(dataQuery, [householdId, userId]);

            if (result.length === 0) {
                logger.error('Nie znaleziono gospodarstwa.');
                return res.status(404).json({status: 'error', message: 'Nie znaleziono gospodarstwa.' });
            }

            logger.info(`Informacje o gospodarstwie ${householdId} pobrane poprawnie.`);
            return res.status(200).json({
                status: 'success',
                message: 'Informacje o gospodarstwie pobrane poprawnie',
                info: result,
            });
        } catch (error) {
            logger.error(`Nie udało się pobrać informacji o gospodarstwie: ${error.stack}`);
            return res.status(500).json({status: 'error', message: 'Nie udało się pobrać danych o gospodarstwie.' });
        }
    } catch (error) {
        logger.error(`Błąd podczas pobierania informacji: ${error.stack}`);
        return res.status(500).json({status: 'error', message: 'Błąd podczas pobierania gospodarstw.' });
    }
});

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


router.delete('/delete', verifyJWT(), async (req, res) => {
    const houseId = req.house;
    const userId = req.userId;
    const { houseName } = req.body;
    console.log(`houseId: ${houseId}, userId: ${userId}, houseName: ${houseName}`);
    if (!houseId || !userId || !houseName) {
        logger.error('Podaj prawidłowe dane do usunięcia gospodarstwa.');
        return res.status(400).json({ status: 'error', message: 'Podaj prawidłowe dane do usunięcia gospodarstwa.' });
    };

    try {

        const ownershipQuery = 'SELECT ownerId FROM households WHERE houseId=?';

        const [ownership] = await pool.query(ownershipQuery, [houseId]);

        if (ownership[0].ownerId !== userId) {
            logger.error('Brak uprawnień do usunięcia gospodarstwa.');
            return res.status(403).json({ status: 'error',message: 'Brak uprawnień do usunięcia gospodarstwa.' });
        }

        const deleteQuery = 'DELETE FROM households WHERE houseId=? AND ownerId=?';

        try {
            const [result] = await pool.query(deleteQuery, [houseId, userId]);

            if (result.affectedRows == 0) {
                logger.info('Nie znaleziono gospodarstwa.');
                return res.status(404).json({status: 'error', message: 'Nie znaleziono gospodarstwa.' });
            };

            return res.status(200).json({
                status: 'success',
                message: `Gospodarstwo ${houseName} usunięte.`,
            });

        } catch (error) {
            logger.error(`Nie udało się usunąć gospodarstwa ${error.message}`);
            return res.status(500).json({status: 'error', message: 'Nie udało się usunąć gospodarstwa.' });
        }
    } catch (error) {
        logger.error(`Błąd podczas usuwania gospodarstwa: ${error}`);
        return res.status(500).json({status: 'error', message: 'Błąd podczas usuwania gospodarstwa.' });
    };
});

module.exports = router;