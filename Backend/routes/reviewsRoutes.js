const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const verifyJWT = require('../middlewares/verifyJWT');


router.post('/new', verifyJWT, reviewsController.addReview);

router.get('/collection', reviewsController.getReviewsCollection);

module.exports = router;