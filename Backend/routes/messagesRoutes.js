const express = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

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

router.post('/send', verifyJWT(), messagesController.sendMessage);

/**
 * @swagger
 * /collection:
 *   get:
 *     summary: Pobiera wszystkie wiadomości związane z użytkownikiem (wysłane i otrzymane).
 *     tags:
 *       - Messages
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Pomyślnie pobrano wiadomości.
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
 *                   example: Pobrano wiadomości
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID wiadomości.
 *                       senderId:
 *                         type: string
 *                         description: ID nadawcy wiadomości.
 *                       recipientId:
 *                         type: string
 *                         description: ID odbiorcy wiadomości.
 *                       content:
 *                         type: string
 *                         description: Treść wiadomości.
 *                       datetime:
 *                         type: string
 *                         format: date-time
 *                         description: Data i czas wysłania wiadomości.
 *                       is_read:
 *                         type: boolean
 *                         description: Status odczytu wiadomości.
 *       404:
 *         description: Nie znaleziono wiadomości.
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
 *                   example: Nie znaleziono wiadomości :(
 *       500:
 *         description: Wystąpił błąd podczas pobierania wiadomości.
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
 *                   example: Wystąpił błąd podczas pobierania wiadomości.
 */

router.get('/collection', verifyJWT(), messagesController.getMessages);

router.delete('/delete', messagesController.deleteMessage);

module.exports = router;
