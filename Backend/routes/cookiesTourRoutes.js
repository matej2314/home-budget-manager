const express = require('express');
const router = express.Router();
const cookiestourController = require('../controllers/cookiesTourController');
const verifyJWT = require('../middlewares/verifyJWT');

router.post('/cookie_value', verifyJWT(), cookiestourController.setCookieValue);

router.post('/tour_value', verifyJWT(), cookiestourController.setTourValue);

module.exports = router;