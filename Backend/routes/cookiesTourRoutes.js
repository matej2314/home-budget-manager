const express = require('express');
const router = express.Router();
const cookiestourController = require('../controllers/cookiesTourController');
const verifyJWT = require('../middlewares/verifyJWT');

router.post('/cookie_value', verifyJWT, cookiestourController.setCookieValue);

module.exports = router;