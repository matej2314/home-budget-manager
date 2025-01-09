const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const logger = require('../configs/logger');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.get('/all',verifyJWT(), async (req, res) => {
    const query = 'SELECT id, role, name, household_id from users ORDER By id';
    const connection = await pool.getConnection();

    try {
        const [rows] = await pool.query(query);
        logger.info('Lista wszystkich użytkowników pobrana poprawnie.');
        return res.status(200).json({
            status: 'success',
            message: 'Lista wszystkich użytkowników pobrana poprawnie',
            users: rows,
        });

    } catch (error) {
        logger.error(`Błąd podczas pobierania listy użytkowników: ${error}`);
        return res.status(500).json({ status: 'error', mesage: 'Bląd pobierania listy użytkowników' });
    } finally {
        connection.release();
    }
});

router.get('/house', verifyJWT(), async (req, res) => {
    const houseId = req.house;
 
    const query = 'SELECT id, role, name, email FROM users WHERE household_id=? ORDER BY id';
    const connection = await pool.getConnection();

    try {
        const [rows] = await pool.query(query, [houseId]);
        logger.info(`Lista użytkowników gospodarstwa ${houseId} pobrana poprawnie`);
        return res.status(200).json({
            status: 'success',
            message: `Lista użytkowników gospodarstwa ${houseId} pobrana poprawnie`,
            users: rows,
        });

    } catch (error) {
        logger.error(`Nie udało się pobrać listy użytkowników gospodarstwa ${houseId}`);
        return res.status(500).json({
            status: 'error',
            message: 'Nie udało się pobrać listy użytkowników gospodarstwa.',
        });
    } finally {
        connection.release();
    }

});

//all users
router.post('/delete/:userId', verifyJWT(), async (req, res) => {
    const userId = req.params.userId;

    const checkHousehold = 'SELECT household_id FROM users WHERE id = ?';
    const delUserQuery = 'DELETE FROM users WHERE id = ?';
    const deleteHouse = 'DELETE FROM households WHERE houseId = ?';

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [householdResult] = await connection.query(checkHousehold, [userId]);
        if (householdResult.length > 0) {
            const householdId = householdResult[0].household_id;

            await connection.query(deleteHouse, [householdId]);
            logger.info(`Gospodarstwo użytkownika ${userId} (ID: ${householdId}) usunięte.`);
        } else {
            logger.info(`Użytkownik ${userId} nie ma przypisanego gospodarstwa.`);
        }

        await connection.query(delUserQuery, [userId]);
        logger.info(`Użytkownik ${userId} usunięty poprawnie.`);

        await connection.commit();

        return res.status(200).json({ status: 'success', message: 'Użytkownik usunięty poprawnie.' });

    } catch (error) {

        await connection.rollback();

        logger.error(`Błąd podczas usuwania użytkownika ${userId}: ${error.message}`);
        return res.status(500).json({ status: 'error', message: 'Błąd serwera.' });

    } finally {
        connection.release();
    }
});

router.post('/delete/:inhabitantId', verifyJWT(), async (req, res) => {
    const inhabitantId = req.params.inhabitantId;
    const connection = await pool.getConnection();
    const house = req.house;

    const checkInhabitantQuery = 'SELECT inhabitant FROM users WHERE id=?';
    const deleteInhabitantQuery = 'DELETE FROM users WHERE id=?';

    try {
        await connection.beginTransaction();
        
        const [checkInhabitant] = await connection.query(checkInhabitantQuery, [inhabitantId]);
        
        if (checkInhabitant.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                status: 'error',
                message: 'Nie znaleziono użytkownika do usunięcia.',
            });
        }

        const inhabitant = checkInhabitant[0];

        if (inhabitant === house) {
            await connection.query(deleteInhabitantQuery, [inhabitantId]);
            logger.info(`Domownik ${inhabitantId} gospodarstwa ${house} usunięty.`);
            await connection.commit();
            return res.status(200).json({
                status: 'success',
                message: `Domownik ${inhabitantId} gospodarstwa ${house} usunięty.`,
            });
        } else {
            await connection.rollback();
            return res.status(403).json({
                status: 'error',
                message: 'Nie masz uprawnień do usunięcia tego użytkownika.',
            });
        }
    } catch (error) {
        await connection.rollback();
        logger.error(`Nie udało się usunąć domownika ${inhabitantId} z gospodarstwa ${house}: ${error.message}`);
        return res.status(500).json({
            status: 'error',
            message: 'Nie udało się usunąć domownika.',
        });
    } finally {
        connection.release();
    }
});


module.exports = router;