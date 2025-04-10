import express, {Request, Response, NextFunction} from 'express';
import path from 'path';
import logger from '@configs/logger';
import avatarController from '@controllers/avatarController';
import verifyJWT from '@middlewares/verifyJWt';
import createUserDirectory from '@middlewares/createUserDirectory';
import deleteFiles from '@middlewares/deleteFilesInDirectory';
import saveAvatar from '@store/avatarStorage';

const router = express.Router();

/**
 * @swagger
 * /avatars/save:
 *   post:
 *     summary: Upload user avatar
 *     tags:
 *       - Avatars
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *             required:
 *               - avatar
 *     responses:
 *       200:
 *         description: Avatar saved correctly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Avatar saved correctly.
 *                 avatarName:
 *                   type: string
 *                   example: avatar12345.png
 *       400:
 *         description: Missing file or incorrect file upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Upload the correct file.
 *       500:
 *         description: Server error while saving avatar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Saving avatar error.
 */


router.post('/save',
    verifyJWT,
    createUserDirectory,
    saveAvatar.single('avatar'),
    avatarController.addAvatar
);

/**
 * @swagger
 * /avatars/avatar/{userId}:
 *   get:
 *     summary: Get avatar of a specific user
 *     tags:
 *       - Avatars
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: false
 *         description: ID of the user whose avatar should be fetched. If not provided, avatar of the logged-in user is returned.
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Avatar image
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */


router.get('/avatar/:userId?', async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.userId) {
        return next();
    }

    return verifyJWT(req, res, next);
}, avatarController.getAvatar);

/**
 * @swagger
 * /avatars/delete:
 *   delete:
 *     summary: Delete the avatar of the authenticated user
 *     tags:
 *       - Avatars
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Avatar removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User's john_doe avatar removed correctly.
 *       500:
 *         description: Error removing the avatar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Removing avatar error.
 */

router.delete('/delete',
    verifyJWT,
    deleteFiles,
    avatarController.deleteAvatar
);


module.exports = router;