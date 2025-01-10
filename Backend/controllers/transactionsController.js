const pool = require('../database/db');
const { v4: uuidv4 } = require('uuid');
const logger = require('../configs/logger');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const actionQueries = require('../database/transactionsQueries');

exports.addNewAction = async (req, res) => {
    const { type, value } = req.body;
    const transactionId = uuidv4();
    const householdId = req.house;
    const userId = req.userId;

    const types = ['income', 'cost'];
    
    if (!type || !types.includes(type) || !value || !transactionId || !householdId || !userId) {
        logger.error('Brak danych do usunięcia transakcji.');
        return res.status(400).json({
            status: 'error',
            message: 'Prześlij poprawne dane.'
        });
    }

    const connection = await pool.getConnection(); 

    try {
        await connection.beginTransaction();

        const [response] = await connection.query(actionQueries.newitemQuery, [transactionId, userId, householdId, type, value]);
        logger.info('Transakcja dodana poprawnie.');

        await connection.commit();

        return res.status(200).json({
            status: 'success',
            message: 'Transakcja dodana poprawnie',
            transactionId
        });

    } catch (error) {
        await connection.rollback(); 
        logger.error(`Nie udało się dodać transakcji dla gospodarstwa ${householdId}`);
        return res.status(500).json({
            status: 'error',
            message: 'Nie udało się dodać transakcji.',
        });
    } finally {
        await connection.release();
    };
};

exports.getAllActions = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query(actionQueries.allQuery);

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
    } finally {
        await connection.release();
    };
};

exports.getHouseActions = async (req, res) => {
    const owner_id = req.userId;
    const householdId = req.house;

    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query(actionQueries.getQuery, [owner_id, householdId]);

        if (rows.length == 0) {
            logger.error(`Brak transakcji dla gospodarstwa ${householdId}`);
            return res.status(404).json({ status: 'error', message: 'Brak transakcji dla gospodarstwa.' });
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
    } finally {
        connection.release();
    }
};

exports.deleteAction = async (req, res) => {
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

    const connection = await pool.getConnection();

    try {
        const [result] = await connection.query(actionQueries.deleteQuery, [userId, householdId, transactionId]);

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
    } finally {
        connection.release();
    }
};