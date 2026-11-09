const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const verifyJWT = require('../middlewares/verifyJWT');

/**
 * @swagger
 * /message/send:
 *   post:
 *     summary: Send a private message to another user
 *     tags:
 *       - Message
 *     security:
 *       - cookieAuth: []
 *     description: Allows an authenticated user to send a message to another registered user. Requires a valid session (SESSID cookie).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientName
 *               - content
 *             properties:
 *               recipientName:
 *                 type: string
 *                 example: jan.kowalski
 *               content:
 *                 type: string
 *                 example: Cześć, czy możemy się spotkać dzisiaj po południu?
 *     responses:
 *       200:
 *         description: Message successfully sent
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
 *                   example: sendMessage.successMessage
 *       400:
 *         description: Missing required data or recipient not found
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
 *                   example: Enter required message data.
 *       401:
 *         description: Unauthorized - missing or invalid JWT token (cookie)
 *       500:
 *         description: Internal server error while sending the message
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


router.post('/send', verifyJWT, messagesController.sendMessage);

/**
 * @swagger
 * /message/readed:
 *   put:
 *     summary: Mark a message as read
 *     tags:
 *       - Message
 *     security:
 *       - cookieAuth: []
 *     description: Allows an authenticated user to mark a received message as read. Requires message ID and a valid session (SESSID cookie).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messageId
 *             properties:
 *               messageId:
 *                 type: string
 *                 example: 06b929ae-7b84-4f1c-9e1a-7d6ac070be45
 *     responses:
 *       200:
 *         description: Message marked as read successfully
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
 *                   example: Message status updated correctly.
 *       400:
 *         description: Message ID not provided
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
 *                   example: Enter correctly message data.
 *       401:
 *         description: Unauthorized - missing or invalid JWT token (cookie)
 *       404:
 *         description: Message not found or not authorized
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
 *                   example: Messages not found.
 *       500:
 *         description: Internal server error while updating message
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

router.put('/readed', verifyJWT, messagesController.markMessage);

/**
 * @swagger
 * /message/delete:
 *   delete:
 *     summary: Delete a message
 *     tags:
 *       - Message
 *     security:
 *       - cookieAuth: []
 *     description: Allows an authenticated user to delete a message by its ID. Requires valid session cookie (SESSID).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messageId
 *             properties:
 *               messageId:
 *                 type: string
 *                 example: 4d7c0db5-7e92-4785-91fa-9dc9a4f84b8d
 *     responses:
 *       200:
 *         description: Message deleted successfully
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
 *                   example: Message deleted correctly.
 *       400:
 *         description: No message ID provided
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
 *                   example: Point out the message!
 *       401:
 *         description: Unauthorized - missing or invalid JWT token (cookie)
 *       404:
 *         description: Message not found
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
 *                   example: Messages not found.
 *       500:
 *         description: Internal server error during deletion
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

router.delete('/delete', verifyJWT, messagesController.deleteMessage);

module.exports = router;
