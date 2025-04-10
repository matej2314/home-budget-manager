import express from 'express';
import saveScreen from '@store/screensStorage';
import galleryController from '@controllers/galleryController';
import verifyJWT from '@middlewares/verifyJWT';
import verifyRole from '@middlewares/verifyRole';

const router = express.Router();

router.post('/save',
    verifyJWT,
    verifyRole('superadmin'),
    saveScreen.array('screens', 15),
    galleryController.saveImages);

module.exports = router;