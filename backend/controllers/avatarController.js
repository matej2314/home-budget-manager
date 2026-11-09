const logger = require('../configs/logger');
const path = require('path');
const fs = require('fs/promises')
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

exports.addAvatar = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(statusCode.BAD_REQUEST).json({
                status: 'error',
                message: 'Upload the correct file.',
            });
        }
        res.status(statusCode.OK).json({
            status: 'success',
            message: 'Avatar saved correctly.',
            avatarName: req.file.filename,
        })
    } catch (error) {
        logger.error(`Saving avatar error: ${error}`)
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Saving avatar error.',
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
            const filePath = `${avatarDir}/${userId}/${userId}${ext}`;
            try {
                await fs.access(filePath);
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
            message: `User's  ${userName} avatar removed correctly.`
        })
    } catch (error) {
        logger.error(`Removing avatar error: ${error}`);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: `Removing avatar error.`
        });
    };
};

