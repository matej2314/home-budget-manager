const pool = require('../database/db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const logger = require('../configs/logger');
const { isValidPassword, isValidEmail, isValidUsername } = require('../utils/validation');
const jwtCookieOptions = require('../configs/jwtCookieOptions');

exports.registerUser = async (req,res) => {

}