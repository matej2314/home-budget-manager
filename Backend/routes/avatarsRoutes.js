const express = require('express');
const router = express.Router();
const path = require('path');
const logger = require('../configs/logger');
const avatarController = require('../controllers/avatarController');
const verifyJWT = require('../middlewares/verifyJWT');
const createUserDirectory = require('../middlewares/createUserDirectory');
const deleteFiles = require('../middlewares/deleteFilesInDirectory');
const saveAvatar = require('../store/avatarStorage');

router.post('/save',
    verifyJWT,
    createUserDirectory,
    saveAvatar.single('avatar'),
    avatarController.addAvatar
);

router.get('/avatar/:userId?', async (req, res, next) => {
    if (req.params.userId) {
        return next();
    }

    return verifyJWT(req, res, next);
}, avatarController.getAvatar);

router.delete('/delete',
    verifyJWT,
    deleteFiles,
    avatarController.deleteAvatar
);


module.exports = router;