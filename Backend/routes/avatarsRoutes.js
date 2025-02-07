const express = require('express');
const router = express.Router();
const logger = require('../configs/logger');
const verifyJWT = require('../middlewares/verifyJWT');
const createUserDirectory = require('../middlewares/createUserDirectory');
const deleteFiles = require('../middlewares/deleteFilesInDirectory');
const saveAvatar = require('../store/avatarStorage');

router.post('/save',
    verifyJWT(),
    createUserDirectory,
    saveAvatar.single('avatar'),
    async (req, res) => {
        try {
            const userId = req.userId;
            
            if (!req.file) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Nie przesłano poprawnego pliku.',
                });
            };

            const avatarPath = `/user-photos/${userId}/${req.file.filename}`;

            res.status(200).json({
                status: 'success',
                message: 'Avatar zapisany pomyślnie.',
                avatarUrl: avatarPath,
            })
        } catch (error) {
            logger.error(`Błąd podczass zapisywania avatara: ${error}`)
            res.status(500).json({
                status: 'error',
                message: 'Wystąpił błąd podczas zapisywania avatara.',
            });
       }
});

router.delete('/delete',
    verifyJWT(),
    deleteFiles,
    async (req, res) => {
    try {
        const userName = req.userName;

        res.status(200).json({
            status: 'success',
            message: `Avatar użytkownika ${userName} usunięty.`
        })
    } catch (error) {
        logger.error(`Błąd podczas usuwania avatara: ${error}`);
        res.status(500).json({
            status: 'error',
            message: `Wystąpił błąd podczas usuwania avatara.`
        });
    };
});














module.exports = router;