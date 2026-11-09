const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController.js');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRole = require('../middlewares/verifyRole.js');

/**
 * @swagger
 * /users/collection:
 *   get:
 *     summary: Get all users (only for superadmin)
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     description: Retrieves the list of all users. Access restricted to users with role `superadmin`.
 *     responses:
 *       200:
 *         description: Successfully fetched users
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
 *                   example: User's list fetched correctly.
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: 123e4567-e89b-12d3-a456-426614174000
 *                       userName:
 *                         type: string
 *                         example: admin
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: admin@example.com
 *                       role:
 *                         type: string
 *                         example: superadmin
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-01-01T12:00:00Z
 *       404:
 *         description: Users not found or unexpected status returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: notfound
 *                 message:
 *                   type: string
 *                   example: Users not found.
 *       500:
 *         description: Server error while fetching user list
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
 *                   example: Error fetching user's list.
 */

router.get('/collection', verifyJWT, verifyRole('superadmin'), usersController.getAllUsers);

/**
 * @swagger
 * /users/delete/{userId}:
 *   post:
 *     summary: Delete a user by ID (only for superadmin)
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the user to be deleted
 *     description: |
 *       Deletes a user by ID. If the user is a host, their household and transactions are also removed. 
 *       Requires the requester to be authenticated and have the `superadmin` role.
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *                   example: User 123e4567-e89b-12d3-a456-426614174000 deleted correctly.
 *       400:
 *         description: Invalid input data (e.g. missing user ID)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: badreq
 *                 message:
 *                   type: string
 *                   example: Invalid input data.
 *       500:
 *         description: Internal server error while deleting user
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

router.post('/delete/:userId', verifyJWT, verifyRole('superadmin'), usersController.deleteUser);

/**
 * @swagger
 * /users/delete/{inhabitant}:
 *   delete:
 *     summary: Delete a housemate (only for host users)
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: inhabitant
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the inhabitant (housemate) to be deleted
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inhabitantId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the inhabitant to be removed from the house
 *             required:
 *               - inhabitantId
 *     description: |
 *       Deletes a housemate from the household, removes their transactions, and changes their role to "user". 
 *       The request must be made by a host user. 
 *     responses:
 *       200:
 *         description: Housemate deleted successfully
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
 *                   example: Housemate deleted correctly.
 *       400:
 *         description: Invalid input data (missing inhabitant ID)
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
 *                   example: Enter correctly data!
 *       500:
 *         description: Internal server error while deleting housemate
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
 *                   example: Failed to delete housemate.
 */

router.delete('/delete/:inhabitant', verifyJWT, verifyRole('host'), usersController.deleteInhabitant);

/**
 * @swagger
 * /users/invite:
 *   post:
 *     summary: Invite a user to a house (only for users with 'mates' or 'host' role)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The username of the user to be invited to the house
 *                 example: "john_doe"
 *             required:
 *               - userName
 *     responses:
 *       200:
 *         description: User successfully invited to the house
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
 *                   example: User successfully invited by a mate. (or Host)
 *       400:
 *         description: Invalid input data or invalid request (e.g., user not found, user already in house)
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
 *                   example: Invalid input user data.
 *       401:
 *         description: Unauthorized access (invalid or missing JWT token)
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
 *                   example: Unauthorized. Invalid or missing JWT token.
 *       500:
 *         description: Internal server error while processing the invitation
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
 *                   example: Failed to invite user. Please try again later.
 *       403:
 *         description: Forbidden action (the user must have the correct role to invite)
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
 *                   example: You do not have permission to invite users.
 *       404:
 *         description: The house or invited user does not exist
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
 *                   example: House not found or invited user does not exist.
 *       409:
 *         description: Conflict (the invited user is already a housemate or host)
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
 *                   example: User is already a housemate or host.
 *       422:
 *         description: User is being invited by someone who is not a host or a mate
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
 *                   example: Only hosts or mates can invite users.
 */

router.post('/invite', verifyJWT, verifyRole('mates'), usersController.addUserToHouse);

/**
 * @swagger
 * /users/changemail:
 *   post:
 *     summary: Change the user's email address
 *     description: Allows a user to change their email address. The user must be authenticated.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newEmail:
 *                 type: string
 *                 format: email
 *                 description: The new email address to be set for the user
 *                 example: "newemail@example.com"
 *             required:
 *               - newEmail
 *     responses:
 *       200:
 *         description: Email address changed successfully
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
 *                   example: Email address changed successfully.
 *       400:
 *         description: Invalid email format or missing email
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
 *                   example: "Enter correctly e-mail address!"
 *       404:
 *         description: User not found
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
 *                   example: "URL not found."
 *       409:
 *         description: The new email is already in use
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
 *                   example: "The new email address is already taken."
 *       500:
 *         description: Internal server error while changing the email
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
 *                   example: "Internal server error."
 */

router.post('/changemail', verifyJWT, usersController.changeEmail);

module.exports = router;