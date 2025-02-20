const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
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
            
            if (!req.file) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Nie przesłano poprawnego pliku.',
                });
            };

           

            res.status(200).json({
                status: 'success',
                message: 'Avatar zapisany pomyślnie.',
                avatarName: req.file.filename,
            })
        } catch (error) {
            logger.error(`Błąd podczass zapisywania avatara: ${error}`)
            res.status(500).json({
                status: 'error',
                message: 'Wystąpił błąd podczas zapisywania avatara.',
            });
       }
    });

router.get('/avatar/:userId?', verifyJWT(), async (req, res) => {
    let userId = req.params.userId || req.userId;

    const avatarDir = path.join(__dirname, '../public/user-photos', `${userId}`);
    const avatarExtensions = ['.jpg', '.jpeg', '.png'];
    let avatarPath = null;

    for (const ext of avatarExtensions) {
        const filePath = path.join(avatarDir, `${userId}${ext}`);

        try {
            
            await fs.access(filePath); 
            avatarPath = filePath;
            break; 
        } catch (err) {
            continue;
        }
    }

    if (!avatarPath) {
        return res.sendFile(path.join(__dirname, '../public/user-photos', 'default.jpg'));
    }

    res.sendFile(avatarPath);
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