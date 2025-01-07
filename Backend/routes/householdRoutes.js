const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../database/db');
const logger = require('../configs/logger');
const { v4: uuidv4 } = require('uuid');
const verifyJWT = require('../middlewares/verifyJWT.js');
const JWT_SECRET = process.env.JWT_SECRET;
const jwtCookieOptions = require('../configs/jwtCookieOptions.js');

router.post('/new', verifyJWT(), async (req, res) => {
    const userId = req.userId;
    const { houseName } = req.body;
    const houseId = uuidv4();
    
    if (!userId || !houseName || !houseId) {
        logger.error('Brak danych, aby dodać nowe gospodarstwo. userId lub houseName są puste.');
        return res.status(400).json({ status: 'error', message: 'Podaj wszystkie niezbędne informacje.' });
    };

    const checkQuery = 'SELECT * FROM households WHERE houseName=?';

    try {
        const [results] = await pool.query(checkQuery, [houseName]);
        if (results.length > 0) {
            logger.error('Takie gospodarstwo już istnieje.');
            return res.status(400).json({ status: 'error', message: 'Takie gospodarstwo już istnieje.' });
        }
    } catch (error) {
        logger.error(`Błąd podczas sprawdzania gospodarstwa: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd podczas sprawdzania gospodarstwa.' });
    }
    
        const addQuery = 'INSERT INTO households (houseId, ownerId, houseName) VALUES (?, ?, ?)';
       
    try {
            await pool.query(addQuery, [houseId, userId, houseName]);
        logger.info(`Gospodarstwo ${houseName} dodane poprawnie.`);
        
        const token = jwt.sign({ id: userId, role: req.role, userName: req.userName, houseHold: houseId }, JWT_SECRET, { expiresIn: '24h' });

        res.cookie('SESSID', token, {
            ...jwtCookieOptions,
            maxAge: 86400000,
        });

            return res.status(201).json({
                status: 'success',
                message: `Gospodarstwo ${houseName} dodane poprawnie.`,
                houseId,
            });
        } catch (error) {
            logger.error(`Błąd podczas dodawania gospodarstwa: ${error}`);
            return res.status(500).json({ status: 'error', message: 'Błąd podczas dodawania gospodarstwa.' });
    };
});


router.get('/all', async (req, res) => {
    const query = 'SELECT houseId, houseName, owner_id FROM households ORDER BY houseId';
    
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


router.get('/info', verifyJWT, async (req, res) => {
    try {
        const userId = req.userId;
        const householdId = req.house;

        if (!userId || !householdId) {
            logger.error('Brak danych do pobrania informacji o gospodarstwie.');
            return res.status(400).json({status: 'error', message: 'Brak poprawnych informacji.' });
        }

        const dataQuery = 'SELECT * FROM households WHERE houseId=? AND owner_id=?';

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