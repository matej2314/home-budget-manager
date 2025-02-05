const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT.js');
const verifyRole = require('../middlewares/verifyRole.js');
const initMonthlyController = require('../controllers/initMonthlyBudgetController.js');

router.post('/new', verifyJWT(), verifyRole('mates'), initMonthlyController.addNewMonthlyBudget);

router.put('/:budgetId', verifyJWT(), verifyRole('mates'), initMonthlyController.updateInitMonthlyBudget);

module.exports = router;