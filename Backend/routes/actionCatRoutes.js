const express = require('express');
const router = express.Router();
const actionCatController = require('../controllers/actionCatController');
const verifyRole = require('../middlewares/verifyRole');
const verifyJWT = require('../middlewares/verifyJWT');

router.post('/new',verifyJWT(), verifyRole('superadmin'), actionCatController.addNewActionCat);

router.get('/collection',verifyJWT(), verifyRole('superadmin'), actionCatController.actionCatCollection);

router.delete('/delete', verifyJWT(), verifyRole('superadmin'), actionCatController.deleteActionCat);

module.exports = router;