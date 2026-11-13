import express from 'express';
import verifyJWT from '../middlewares/verifyJWT.js';
import verifyRole from '../middlewares/verifyRole.js';
import { getBoardDataHandler } from '../controllers/boardController.js';

const router = express.Router();

/**
 * @swagger
 * /board/data:
 *   get:
 *     summary: Pobierz dane związane z użytkownikiem i gospodarstwem.
 *     tags:
 *       - Dashboard
 *     security:
 *       - cookieAuth: []
 */

router.get('/data/:filter?/:page?', verifyJWT, verifyRole('mates'), getBoardDataHandler);

export default router;
