import express from 'express';
import saveScreen from '../store/screensStorage.js';
import * as galleryController from '../controllers/galleryController.js';
import verifyJWT from '../middlewares/verifyJWT.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = express.Router();

router.post('/save',
    verifyJWT,
    verifyRole('superadmin'),
    saveScreen.array('screens', 15),
    galleryController.saveImages);

export default router;
