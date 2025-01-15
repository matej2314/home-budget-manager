const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const pool = require('../database/db');
const logger = require('../configs/logger');
const actionCatController = require('../controllers/actionCatController');

router.post('/new', actionCatController.addNewActionCat);

router.get('/collection', actionCatController.actionCatCollection);

router.delete('/delete', actionCatController.deleteActionCat);

module.exports = router;