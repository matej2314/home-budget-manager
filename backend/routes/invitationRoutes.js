const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const invitationController = require('../controllers/invitationController');
const verifyRole = require('../middlewares/verifyRole');
const verifyJWT = require('../middlewares/verifyJWT');

/**
 * @swagger
 * /invitation/accept:
 *   post:
 *     summary: Accept an invitation to join a household
 *     tags:
 *       - Invitation
 *     security:
 *       - cookieAuth: []
 *     description: This endpoint is accessible only by users with the 'host' role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invitationId
 *               - invitedUserId
 *             properties:
 *               invitationId:
 *                 type: string
 *                 description: The ID of the invitation to accept
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               invitedUserId:
 *                 type: string
 *                 description: The ID of the user being invited to the household
 *                 example: 123e4567-e89b-12d3-a456-426614174001
 *     responses:
 *       200:
 *         description: Invitation successfully accepted and new housemate added
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
 *                   example: Invitation of user 123e4567-e89b-12d3-a456-426614174001 correctly accepted.
 *       400:
 *         description: User does not belong to any household or invalid input
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
 *                   example: You don't belong to any household
 *       401:
 *         description: Unauthorized (JWT cookie missing or invalid)
 *       403:
 *         description: Forbidden - requires 'host' role
 *       500:
 *         description: Internal server error during invitation acceptance
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


router.post('/accept', verifyJWT, verifyRole('host'), invitationController.acceptInvitation);

/**
 * @swagger
 * /invitation/decline:
 *   post:
 *     summary: Decline an invitation to join a household
 *     tags:
 *       - Invitation
 *     security:
 *       - cookieAuth: []
 *     description: This endpoint is accessible only by users with the 'host' role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invitationId
 *             properties:
 *               invitationId:
 *                 type: string
 *                 description: The ID of the invitation to decline
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Invitation successfully rejected
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
 *                   example: Invitation successfully rejected.
 *       400:
 *         description: Invitation not found or invalid status
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
 *                   example: Invitation not found
 *       401:
 *         description: Unauthorized (JWT cookie missing or invalid)
 *       403:
 *         description: Forbidden - requires 'host' role
 *       500:
 *         description: Internal server error during invitation rejection
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
 *                   example: Internal server error
 */


router.post('/decline', verifyJWT, verifyRole('host'), invitationController.rejectInvitation);

/**
 * @swagger
 * /invitation/collection:
 *   get:
 *     summary: Retrieve all new invitations for a host
 *     tags:
 *       - Invitation
 *     security:
 *       - cookieAuth: []
 *     description: This endpoint retrieves all new invitations for the 'host' role. Requires valid SESSID cookie.
 *     responses:
 *       200:
 *         description: Successfully retrieved the collection of new invitations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 invitations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       invitationId:
 *                         type: string
 *                         example: 123e4567-e89b-12d3-a456-426614174000
 *                       houseId:
 *                         type: string
 *                         example: 987e4567-e89b-12d3-a456-426614174000
 *                       invitedUserId:
 *                         type: string
 *                         example: 456e4567-e89b-12d3-a456-426614174000
 *                       status:
 *                         type: string
 *                         example: new
 *       400:
 *         description: No new invitations found
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
 *                   example: Invitations not found.
 *       401:
 *         description: Unauthorized (JWT cookie missing or invalid)
 *       403:
 *         description: Forbidden - requires 'host' role
 *       500:
 *         description: Internal server error while retrieving invitations
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
 *                   example: Internal server error
 */

router.get('/collection', verifyJWT, verifyRole('host'), invitationController.getInvitationsCollection);

module.exports = router;