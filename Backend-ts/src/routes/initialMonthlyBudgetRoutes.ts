import express from 'express';
import initMonthlyController from '@controllers/initMMonthlyBudgetController';
import verifyJWT from '@middlewares/verifyJWT';
import verifyRole from '@middlewares/verifyRole';

const router = express.Router();

/**
 * @swagger
 * /initmonthly/new:
 *   post:
 *     summary: Declare a new monthly budget for a household
 *     tags:
 *       - InitMonthly
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: number
 *                 example: 1000
 *                 description: The budget value to declare for the month
 *     responses:
 *       201:
 *         description: Monthly budget successfully declared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: declareBudget.declaredCorrectlyMessage
 *       400:
 *         description: Invalid input or budget declaration condition error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: declareBudget.inputError
 *       401:
 *         description: Unauthorized (JWT cookie missing or invalid)
 *       403:
 *         description: Forbidden - requires mates role
 *       500:
 *         description: Internal server error during budget declaration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: declareBudget.declareInternalError
 */


router.post('/new', verifyJWT, verifyRole('mates'), initMonthlyController.addNewMonthlyBudget);

module.exports = router;