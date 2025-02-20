const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const reviewsController = require('../controllers/reviewsController');

router.post('/new', verifyJWT(), reviewsController.addReview);

router.get('/collection', verifyJWT(), reviewsController.getReviewsCollection);

module.exports = router;