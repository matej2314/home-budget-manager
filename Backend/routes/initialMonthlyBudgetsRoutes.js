const express = require('express');
const router = express.Router();
const logger = require('../configs/logger.js');
const pool = require('../database/db.js');
const verifyJWT = require('../middlewares/verifyJWT.js');
const { v4: uuidv4 } = require('uuid');
const verifyRole = require('../middlewares/verifyRole.js');
const checkUserHouse = require('../utils/checkUserHouse.js');
const initialBudgetQueries = require('../database/initialMonthlyBudgetQueries.js');

router.post('/new', verifyJWT(), verifyRole('mates'), async (req, res) => {
    const userId = req.userId;
    const { value } = req.body;
    
    if (!value ) {
        return res.status(400).json({ status: 'error', message: 'Podaj budżet!' });
    };

    const connection = await pool.getConnection();
    const id = uuidv4();

    try {
        const checkHouse = await checkUserHouse(connection, userId);
        if (!checkHouse) {
            logger.error(`Użytkownik ${userId} nie należy do żadnego gospodarstwa.`);
            return res.status(400).json({ status: 'error', message: 'Użytkownik nie należy do żadnego gospodarstwa.' });
        };

        const userHouse = checkHouse.houseId;

        const addedAt = new Date();
        const validUntil = new Date(addedAt);
        validUntil.setDate(validUntil.getDate() + 30);
        const validUntilFormatted = validUntil.toISOString().slice(0, 19).replace('T', ' ');
        
        await connection.query(initialBudgetQueries.addInitialBudgetQuery, [id, userHouse, value, validUntilFormatted]);
        logger.info(`Budżet miesięczny gospodarstwa ${userHouse} został dodany dnia ${new Date().toLocaleString()}`);
        return res.status(201).json({ status: 'success', message: 'Budżet miesięczny dodany!' });
    } catch (error) {
        logger.error(`Wystąpił błąd podczas dodawania budżetu miesięcznego: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    } finally {
        if (connection) connection.release();
    }
});

router.put('/:budgetId', verifyJWT(), verifyRole('mates'), async (req, res) => {
    const { budgetId } = req.params;
    const { newValue } = req.body;

    if (!budgetId || newValue <= 0) {
        logger.error('Podaj poprawne dane do wykonania akcji.');
        return res.status(400).json({ status: 'error', message: 'Podaj prawidłowe dane do aktualizacji budżetu.' });
        
    };

    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query(initialBudgetQueries.getAddedAt, [budgetId]);

        if (rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Nie udało się znaleźć wskazanego budżetu.' });
        };
        const addedAt = new Date(rows[0].addedAt);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate());

        if (new Date(addedAt) < sevenDaysAgo.toISOString()) {
            return res.status(400).json({ status: 'error', message: 'Budżetu nie można zmienić po 7 dniach od ustawienia!' });
        };

        const [updateBudget] = await connection.query(initialBudgetQueries.updateBudgetQuery, [newValue, budgetId]);
        logger.info(`Budżet miesięczny ${budgetId} zaktualizowany!`);

        return res.status(200).json({ status: 'success', message: 'Budżet miesięczny zaktualizowany poprawnie.' });

    } catch (error) {
        logger.error(`Błąd podczas aktualizacji budżetu miesięcznego: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd podczas przetwarzania żądania.' });
    } finally {
         connection.release();
    }
})




module.exports = router;