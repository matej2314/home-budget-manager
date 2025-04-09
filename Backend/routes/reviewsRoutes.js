const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const verifyJWT = require('../middlewares/verifyJWT');

/**
 * @swagger
 * /reviews/new:
 *   post:
 *     summary: Add a new user review
 *     tags:
 *       - Reviews
 *     description: |
 *       Authenticated users can add a new review with a rating and content.
 *       JWT token must be included in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: Świetna aplikacja, bardzo intuicyjna!
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       201:
 *         description: Review successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: f08cbd6e-725e-4a5d-a0cb-1a2f6426d410
 *       400:
 *         description: Invalid input data or failed to add review
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
 *                   example: Invalid input data!
 *       500:
 *         description: Internal server error
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


router.post('/new', verifyJWT, reviewsController.addReview);

/**
 * @swagger
 * /reviews/collection:
 *   get:
 *     summary: Get collection of user reviews
 *     tags:
 *       - Reviews
 *     description: Retrieves all user reviews from the database.
 *     responses:
 *       200:
 *         description: Successfully fetched reviews
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
 *                   example: Opinions fetched correctly.
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: f08cbd6e-725e-4a5d-a0cb-1a2f6426d410
 *                       rating:
 *                         type: integer
 *                         example: 5
 *                       userName:
 *                         type: string
 *                         example: JanKowalski
 *                       content:
 *                         type: string
 *                         example: Bardzo dobra aplikacja.
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 123e4567-e89b-12d3-a456-426614174000
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-04-08T15:30:00Z
 *       404:
 *         description: No reviews found
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
 *                   example: Opinions not found.
 *       500:
 *         description: Internal server error
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

router.get('/collection', reviewsController.getReviewsCollection);

module.exports = router;