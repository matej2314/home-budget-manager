const express = require('express');
const router = express.Router();
const initMonthlyController = require('../controllers/initMonthlyBudgetController.js');
const verifyJWT = require('../middlewares/verifyJWT.js');
const verifyRole = require('../middlewares/verifyRole.js');


router.post('/new', verifyJWT, verifyRole('mates'), initMonthlyController.addNewMonthlyBudget);

module.exports = router;