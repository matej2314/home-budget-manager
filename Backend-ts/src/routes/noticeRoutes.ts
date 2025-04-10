import exoress from 'express';
import verifyJWT from '@middlewares/verifyJWT';
import noticeController from '@controllers/notificationController';

const router = exoress.Router();

/**
 * @swagger
 * /notice/collection:
 *   get:
 *     summary: Get all notifications for a user's household
 *     tags:
 *       - Notice
 *     security:
 *       - cookieAuth: []
 *     description: Returns a list of notifications associated with the household of the authenticated user. Requires a valid session cookie (SESSID).
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
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
 *                   example: Notifications fetched correctly.
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 71e45bd1-8b5b-4c45-9204-0b9a71c46b17
 *                       category:
 *                         type: string
 *                         example: General
 *                       noticeData:
 *                         type: string
 *                         example: Garbage pickup on Friday at 8 AM.
 *       400:
 *         description: Invalid input data (e.g., no user ID)
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
 *                   example: Incorrect input data.
 *       403:
 *         description: User does not belong to any household
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
 *                   example: User does not belong to any household.
 *       404:
 *         description: No notifications found for the household
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
 *                   example: Notifications not found.
 *       500:
 *         description: Internal server error while fetching notifications
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
 *                   example: Failed to fetch notifications.
 */


router.get('/collection', verifyJWT, noticeController.GetNoticesCollection);

/**
 * @swagger
 * /notice:
 *   delete:
 *     summary: Delete a specific notification
 *     tags:
 *       - Notice
 *     security:
 *       - cookieAuth: []
 *     description: Deletes a notification that belongs to the authenticated user's household. Requires a valid session cookie (SESSID).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               noticeId:
 *                 type: string
 *                 example: d5e8c2a0-2a1a-4c1d-b91b-07e6ff02f947
 *     responses:
 *       200:
 *         description: Notification deleted successfully
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
 *                   example: Notification removed correctly
 *       400:
 *         description: Invalid input data (e.g., no noticeId)
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
 *                   example: Invalid input data.
 *       403:
 *         description: User does not belong to any household
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
 *                   example: User does not belong to any household
 *       404:
 *         description: Notification not found or deletion failed
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
 *                   example: Notification not found.
 *       500:
 *         description: Internal server error while deleting the notification
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
 *                   example: Failed to delete notification.
 */

router.delete('/', verifyJWT, noticeController.deleteNotification);

module.exports = router;