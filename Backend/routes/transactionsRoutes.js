const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const pool = require('../database/db');
const logger = require('../configs/logger');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.post('/new', verifyJWT(), async (req, res) => {
    const { type, value } = req.body;
    const transactionId = uuidv4();
    const householdId = req.house;
    const userId = req.userId;

    const types = ['income', 'cost'];
    
    if (!type || !types.includes(type) || !value || !transactionId || !householdId || !userId) {
        logger.error('Brak danych do usunięcia transakcji.');
        return res.status(404).json({
            status: 'error',
            message: 'Prześlij poprawne dane.'
        });
    }

    const newitemQuery = 'INSERT INTO transactions (transactionId, userId, householdId, type, value) VALUES (?, ?, ?, ?, ?)';

    try {
        const response = await pool.query(newitemQuery, [transactionId, userId, householdId, type, value]);
        logger.info('Transakcja dodana poprawnie.');
        return res.status(200).json({
            status: 'success',
            message: 'Transakcja dodana poprawnie',
            transactionId
        });
    } catch (error) {
        logger.error(`Nie udało się dodać transakcji dla gospodarstwa ${householdId}`);
        return res.status(500).json({
            status: 'error',
            message: 'Nie udało się dodać transakcji.',
        });
    };
});

router.get('/all', async (req, res) => {
    try {
        const allQuery = 'SELECT * FROM transactions ORDER BY transactionId';
        const [rows] = await pool.query(allQuery);

        if (rows.length == 0) {
            logger.info('Brak transakcji.');
            return res.status(404).json({
                status: 'error',
                message: 'Brak transakcji',
            });
        };

        return res.status(200).json({
            status: 'success',
            message: 'Transakcje pobrane poprawnie',
            actions: rows,
        });

    } catch (error) {
        logger.error(`Bląd podczas pobierania transakcji: ${error.message}`);
        return res.status(500).json({ status: 'error', message: 'Błąd podczas pobierania transakcji.' });
    }
});

router.get('/my', verifyJWT(), async (req, res) => {
    const owner_id = req.userId;
    const householdId = req.house;

    const getQuery = 'SELECT * FROM transactions WHERE userId=? AND householdId=?';

    try {
        const [rows] = await pool.query(getQuery, [owner_id, householdId]);

        if (rows.length == 0) {
            logger.error(`Brak transakcji dla gospodarstwa ${householdId}`);
            return res.status(404).json({ status: 'error', message: 'Brak transakcji dla gospodarstwa,' });
        };

        return res.status(200).json({
            status: 'success',
            message: 'Transakcje dla gospodarstwa pobrane poprawnie',
            actions: rows,
        });

    } catch (error) {
        logger.error(`Błąd podczas pobierania transakcji gospodarstwa ${householdId}: ${error.message}`);
        return res.status(500).json({
            status: 'error',
            message: 'Błąd podczas pobierania transakcji dla gospodarstwa.',
        });
    };
});

router.delete('/', verifyJWT(), async (req, res) => {
    const { transactionId } = req.body;
    const householdId = req.house;
    const userId = req.userId;

    if (!transactionId) {
        logger.error('Brak ID transakcji, którą chcesz usunąć.');
        return res.status(400).json({
            status: 'error',
            message: 'Brak ID transakcji, którą chcesz usunąć',
        });
    };

    const deleteQuery = 'DELETE FROM transactions WHERE userId=? AND householdId=? AND transactionId=?';

    try {
        const [result] = await pool.query(deleteQuery, [userId, householdId, transactionId]);

        if (result.affectedRows == 0) {
            logger.error('Nie znaleziono transakcji');
            return res.status(404).json({status: 'error', message: 'Nie znaleziono transakcji.'})
        };

        return res.status(200).json({
            status: 'success',
            message: `Transakcja ${transactionId} usunięta.`
        });
    } catch (error) {
        logger.error('Nie udało się usunąć transakcji.');
        return res.status(500).json({
            status: 'error',
            message: 'Nie udało się usunąć transakcji.',
        });
    };
});

module.exports = router;