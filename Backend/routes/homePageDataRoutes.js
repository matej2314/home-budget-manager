const express = require('express');
const router = express.Router();
const homeDataController = require('../controllers/homePageDataController');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRole = require('../middlewares/verifyRole');


router.get('/dataCollection', homeDataController.getDataCollection);

router.post('/functionality', verifyJWT, verifyRole('superadmin'), homeDataController.addFunctionality);

router.post('/shortInfo', homeDataController.addShortProjectInfo);



module.exports = router;