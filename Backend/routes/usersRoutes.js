const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const logger = require('../configs/logger');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.get('/all',verifyJWT(), async (req, res) => {
    const query = 'SELECT id, role, name, household_id from users ORDER By id';

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
    };
});

router.get('/house', verifyJWT(), async (req, res) => {
    const houseId = req.house;
 
    const query = 'SELECT id, role, name, email FROM users WHERE household_id=? ORDER BY id';

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
    };

});



router.post('/delete', async (req, res) => {

});

module.exports = router;