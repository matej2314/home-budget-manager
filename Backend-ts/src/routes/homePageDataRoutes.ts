import express from 'express';
import homeDataController from '@controllers/homePageDataController';
import verifyJWT from '@controllers/verifyJWt';
import verifyRole from '@controllers/verifyRole';

const router = express.Router();

/**
 * @swagger
 * /homepage/dataCollection:
 *   get:
 *     summary: Fetch data collection for homepage
 *     tags:
 *       - Homepage
 *     responses:
 *       200:
 *         description: Homepage data retrieved successfully
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
 *                   example: Data retrieved.
 *                 data:
 *                   type: object
 *                   description: Data collection returned by the service
 *       404:
 *         description: Endpoint not found
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
 *         description: Internal server error while retrieving homepage data
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


router.get('/dataCollection', homeDataController.getDataCollection);

/**
 * @swagger
 * /homepage/technology:
 *   post:
 *     summary: Add new technology with name and icon
 *     tags:
 *       - Homepage
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - icon
 *             properties:
 *               name:
 *                 type: string
 *                 example: "JavaScript"
 *                 description: Name of the technology
 *               icon:
 *                 type: string
 *                 example: "javascript-icon.png"
 *                 description: Icon for the technology
 *     responses:
 *       201:
 *         description: Technology added successfully
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
 *                   example: Technology added successfully.
 *       400:
 *         description: Missing required fields (name or icon)
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
 *                   example: Enter technology details!
 *       401:
 *         description: Unauthorized (JWT cookie missing or invalid)
 *       403:
 *         description: Forbidden - requires superadmin role
 *       500:
 *         description: Internal server error while adding technology
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

router.post('/technology', verifyJWT, verifyRole('superadmin'), homeDataController.addTechnology);

module.exports = router;