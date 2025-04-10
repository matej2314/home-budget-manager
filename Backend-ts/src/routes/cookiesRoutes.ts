import express from 'express';
import cookiesController from '@controllers/cookiesController';
import verifyJWT from '@middlewares/verifyJWT';

const router = express.Router();

/**
 * @swagger
 * /cookiestour/cookie_value:
 *   post:
 *     summary: Save user’s cookie consent value
 *     tags:
 *       - Cookies Tour
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cookieValue
 *             properties:
 *               cookieValue:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: |
 *                   Cookie consent value:
 *                   - `1` = Accept all cookies (including analytics/marketing)
 *                   - `0` = Only required cookies (e.g., for authentication)
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cookie consent saved successfully
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
 *                   example: Cookie value set successfully.
 *       400:
 *         description: Missing or invalid cookieValue
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
 *                   example: cookies.valueError
 *       404:
 *         description: URL or route not found
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
 *                   example: URL not found.
 *       500:
 *         description: Internal server error or failure while saving
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
 *                   example: Internal server error.
 */

router.post('/cookie_value', verifyJWT, cookiestourController.setCookieValue);

module.exports = router;