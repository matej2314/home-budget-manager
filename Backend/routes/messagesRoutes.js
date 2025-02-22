const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const verifyJWT = require('../middlewares/verifyJWT');

/**
 * @swagger
 * /send:
 *   post:
 *     summary: Wysyła wiadomość do określonego odbiorcy.
 *     tags:
 *       - Messages
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *                 description: ID odbiorcy wiadomości.
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               content:
 *                 type: string
 *                 description: Treść wiadomości.
 *                 example: "Cześć, jak się masz?"
 *     responses:
 *       200:
 *         description: Wiadomość została wysłana pomyślnie.
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
 *                   example: Wiadomość wysłana.
 *       400:
 *         description: Brak wymaganych danych w żądaniu.
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
 *                   example: Brak danych wymaganych do wysłania wiadomości.
 *       500:
 *         description: Wystąpił błąd podczas wysyłania wiadomości.
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
 *                   example: Wystąpił błąd podczas wysyłania wiadomości.
 */

router.post('/send', verifyJWT, messagesController.sendMessage);

router.put('/readed', verifyJWT, messagesController.markMessage);

router.delete('/delete', verifyJWT, messagesController.deleteMessage);

module.exports = router;
