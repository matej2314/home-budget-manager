const express = require('express');
const router = express.Router();
const homeDataController = require('../controllers/homePageDataController');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRole = require('../middlewares/verifyRole');


router.get('/dataCollection', homeDataController.getDataCollection);

router.post('/technology', verifyJWT, verifyRole('superadmin'), homeDataController.addTechnology);

module.exports = router;