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
                message: 'Prześlij poprawny plik.'
            });
        }

        try {
            const totalAmount = await extractPhotoData(req.file.buffer);

            req.file.buffer = null;

            if (!totalAmount) {
                return res.status(statusCode.BAD_REQUEST).json({
                    status: 'error',
                    message: 'Brak oczekiwanej wartości.'
                });
            }

            res.status(statusCode.OK).json({
                status: 'success',
                message: `Kwota z paragonu: ${totalAmount} PLN`,
                value: totalAmount
            });
        } catch (error) {
            logger.error(`Błąd przetwarzania obrazu: ${error}`);
            res.status(statusCode.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Błąd przetwarzania obrazu.'
            });
        }
    }
);


module.exports = router;