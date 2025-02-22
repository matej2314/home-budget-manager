const express = require('express');
const router = express.Router();
const logger = require('../configs/logger');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRole = require('../middlewares/verifyRole');
const { getBoardData } = require('../controllers/boardController');

/**
 * @swagger
 * /board/data:
 *   get:
 *     summary: Pobierz dane związane z użytkownikiem i gospodarstwem.
 *     description: Endpoint pobiera dane dotyczące gospodarstwa użytkownika, jego mieszkańców, transakcji oraz kategorii akcji. Wymaga uwierzytelnienia i odpowiedniej roli (`mates`).
 *     tags:
 *       - Dashboard
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: cookie
 *         name: SESSID
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT zapisany w cookies`.
 *     responses:
 *       200:
 *         description: Pomyślnie pobrano dane dotyczące użytkownika.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Dane boardu pobrane poprawnie.
 *               dashboardData:
 *                 houseData:
 *                   name: "Dom Testowy"
 *                   host: "user123"
 *                   balance: 1500.50
 *                   balanceDate: "2025-01-01"
 *                 houseMates:
 *                   - userId: 2
 *                     userName: "user456"
 *                 actionsData:
 *                   - transactionId: 10
 *                     value: 50.00
 *                     type: income
 *                     date: "2025-01-10"
 *                     description: "Grocery shopping"
 *                 actionsCatData:
 *                   - categoryId: 1
 *                     categoryName: "Grocery shopping"
 *       404:
 *         description: Nie znaleziono gospodarstwa lub innych danych użytkownika.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Brak gospodarstwa użytkownika.
 *       500:
 *         description: Wystąpił błąd podczas przetwarzania danych.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: "Błąd przetwarzania danych."
 */


router.get('/data/:filter?/:page?', verifyJWT, verifyRole('mates'), async (req, res) => {
    const userId = req.userId;
    const filter = req.params.filter;
    const page = req.params.page;

    try {
        const response = await getBoardData(userId, filter, page);

        if (response.status == 'notfound') {
            return res.status(404).json({ status: 'error', message: response.message });
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
