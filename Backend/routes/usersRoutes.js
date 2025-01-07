const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const logger = require('../configs/logger');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.get('/all', async (req, res) => {

});

//dla poj. gospodarstwa:
router.get('/', async (req, res) => {
    
})

router.post('/delete', async (req, res) => {

});

module.exports = router;