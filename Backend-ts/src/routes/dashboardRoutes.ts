import express, {Request, Response} from 'express';
import logger from '@configs/logger';
import verifyJWT from '@middlewares/verifyJWT';
import verifyRole from '@middlewares/verifyRole';
import { getBoardData } from '@controllers/boardController';
import { GetBoardDataRequest, GetBoardDataResponse } from '@types/getBoardData.js';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();
const statusCode = StatusCodes;

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


router.get('/data/:filter?/:page?', verifyJWT, verifyRole('mates'), async (req: GetBoardDataRequest, res: Response) => {
    const userId = req.userId;
    const filter = req.params.filter;
    const page = req.params.page;

    try {
        const response: GetBoardDataResponse = await getBoardData(userId, filter, page);

        switch (response.status) {
            case 'notfound':
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: response.message
                });
            case 'error':
                return res.status(statusCode.INTERNAL_SERVER_ERROR).json(response);
            case 'success':
                return res.status(statusCode.OK).json(response);
            default:
                return res.status(statusCode.NOT_FOUND).json({
                    status: 'error',
                    message: 'URL not found.',
                });
        };
    } catch (error) {
        logger.error(`board/data error: ${error}`);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Internal server error.',
        });
    };
});

module.exports = router;