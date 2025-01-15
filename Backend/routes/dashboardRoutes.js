const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRole = require('../middlewares/verifyRole');
const checkUserHouse = require('../utils/checkUserHouse');
const logger = require('../configs/logger');
const {getBoardData} = require('../controllers/boardController');

router.get('/data', verifyJWT(), verifyRole('mates'), async (req, res) => {
    const userId = req.userId;
    
    try {
        const response = await getBoardData(userId);

        if (response.status == 'notfound') {
            return res.status(404).json(response);
        } else if (response.status === 'success') {
            return res.status(200).json(response);
        } else if (response.status === 'error') {
            return res.status(500).json(response);
        }
    } catch (error) {
        logger.error(`Błąd w board/data: ${error}`);
        return res.status(500).json({
            status: 'error',
            message: 'Błąd przetwarzania danych.',
        });
    };
});

module.exports = router;
