const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const logger = require('../configs/logger');
const verifyJWT = require('../controllers/verifyJWT');
const verifyAdmin = require('../controllers/verifyAdmin');