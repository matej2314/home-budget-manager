const express = require('express');
const router = express.Router();
const logger = require('../configs/logger');
const { extractPhotoData } = require('../configs/tesseract');
const { uploadReceipt } = require('../store/receiptStorage');
const { StatusCodes } = require('http-status-codes');
const statusCode = StatusCodes;

router.post('/',
    uploadReceipt.single('receipt'),
    async (req, res) => {
        if (!req.file) {
            return res.status(statusCode.BAD_REQUEST).json({
                status: 'error',
                message: 'Upload correct file.'
            });
        }

        try {
            const totalAmount = await extractPhotoData(req.file.buffer);

            req.file.buffer = null;

            if (!totalAmount) {
                return res.status(statusCode.BAD_REQUEST).json({
                    status: 'error',
                    message: "addTransaction.invalidRecognizeInput"
                });
            }

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