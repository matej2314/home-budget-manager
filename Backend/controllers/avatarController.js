const logger = require('../configs/logger');
const path = require('path');
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

exports.addAvatar = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(statusCode.BAD_REQUEST).json({
                status: 'error',
                message: 'Nie przesłano poprawnego pliku.',
            });
        }
        res.status(statusCode.OK).json({
            status: 'success',
            message: 'Avatar zapisany pomyślnie.',
            avatarName: req.file.filename,
        })
    } catch (error) {
        logger.error(`Błąd podczass zapisywania avatara: ${error}`)
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Wystąpił błąd podczas zapisywania avatara.',
        });
    }
};

exports.getAvatar = async (req, res) => {
    try {
        const userId = req.params.userId || req.userId;

        const avatarDir = path.join(__dirname, '../public/user-photos');
        const avatarExtensions = ['.jpg', '.jpeg', '.png'];
        let avatarPath = null;

        for (const ext of avatarExtensions) {
            const filePath = path.join(avatarDir, `${userId}${ext}`);
            try {
                await access(filePath);
                avatarPath = filePath;
                break;
            } catch (err) {
                continue;
            }
        }

        if (!avatarPath) {
            return res.sendFile(path.join(avatarDir, 'default.jpg'));
        }

        res.sendFile(avatarPath);
    } catch (error) {
        console.error(error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};

exports.deleteAvatar = async (req, res) => {
    try {
        const userName = req.userName;

        res.status(statusCode.OK).json({
            status: 'success',
            message: `Avatar użytkownika ${userName} usunięty.`
        })
    } catch (error) {
        logger.error(`Błąd podczas usuwania avatara: ${error}`);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: `Wystąpił błąd podczas usuwania avatara.`
        });
    };
};

