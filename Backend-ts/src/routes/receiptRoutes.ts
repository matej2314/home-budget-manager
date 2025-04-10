import express, {Request, Response} from 'express';
import logger from '@configs/logger';
import  {RequestWithFile}  from '@types/requestWithFile';
import { extractPhotoData } from '@configs/tesseract';
import { uploadReceipt } from '@store/receiptStorage';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();
const statusCode = StatusCodes;

/**
 * @swagger
 * /receipt:
 *   post:
 *     summary: Extract total amount from uploaded receipt image
 *     tags:
 *       - Notice
 *     description: |
 *       Upload a receipt image and extract the total amount using OCR. 
 *       Requires a multipart/form-data request with the file under the field name `receipt`.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               receipt:
 *                 type: string
 *                 format: binary
 *                 description: Image of the receipt to analyze
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Total amount successfully extracted from the receipt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 value:
 *                   type: number
 *                   example: 37.49
 *       400:
 *         description: Invalid input file or failed OCR extraction
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
 *                   example: Upload correct file.
 *       500:
 *         description: Internal server error during image processing
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
 *                   example: addTransaction.recognizeInternalError
 */

router.post('/',
    uploadReceipt.single('receipt'),
    async (req: RequestWithFile, res: Response) => {
        if (!req.file) {
                res.status(statusCode.BAD_REQUEST).json({
                status: 'error',
                message: 'Upload correct file.'
            });
        }

        try {
            const totalAmount = await extractPhotoData(req.file.buffer);
            req.file.buffer = null;

            if (!totalAmount) {
                    res.status(statusCode.BAD_REQUEST).json({
                    status: 'error',
                    message: "addTransaction.invalidRecognizeInput"
                });
            }

            // Tu usuwamy return
            res.status(statusCode.OK).json({
                status: 'success',
                value: totalAmount
            });
        } catch (error) {
            logger.error(`Image processing error: ${error}`);
            res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: "addTransaction.recognizeInternalError"
            });
        }
    }
);



module.exports = router;