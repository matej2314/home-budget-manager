const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const logger = require('../configs/logger');
const verifyJWT = require('../middlewares/verifyJWT');

router.post('/new', async (req, res) => {

});

router.get('/collection', async (req, res) => {

});

router.delete('/:noticeId', async (req, res) => {

});