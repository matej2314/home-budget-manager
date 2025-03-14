const express = require('express')
const router = express.Router();
const saveScreen = require('../store/screensStorage');
const galleryController = require('../controllers/galleryController');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRole = require('../middlewares/verifyRole');


router.get('/collection', galleryController.getImages);

router.post('/save',
    verifyJWT,
    verifyRole('superadmin'),
    saveScreen.array('screens', 15),
    galleryController.saveImages);

module.exports = router;