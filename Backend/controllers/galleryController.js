const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

/**
 * @swagger
 * /gallery/save:
 *   post:
 *     summary: Upload multiple images to gallery (up to 15)
 *     tags:
 *       - Gallery
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               screens:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images to upload (max 15 files)
 *     responses:
 *       200:
 *         description: Files uploaded successfully
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
 *                   example: Files saved correctly.
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fileName:
 *                         type: string
 *                         example: screen_1.jpg
 *                       path:
 *                         type: string
 *                         example: uploads/screens/screen_1.jpg
 *       400:
 *         description: No files provided
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
 *                   example: Invalid input data. Files not found.
 *       401:
 *         description: Unauthorized (JWT cookie missing or invalid)
 *       403:
 *         description: Forbidden - requires superadmin role
 *       500:
 *         description: Internal server error
 */

exports.saveImages = async (req, res) => {
    if (!req.file && (!req.files || req.files.length === 0)) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: 'error',
            message: 'Invalid input data. Files not found.',
        })
    };

    const uploadedFiles = req.files.map(file => ({
        fileName: file.filename,
        path: file.path,
    }))

    return res.status(statusCode.OK).json({
        status: 'success',
        message: 'Files saved correctly.',
        files: uploadedFiles,
    });
};