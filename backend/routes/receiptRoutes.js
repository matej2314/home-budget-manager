import express from 'express';
import { extractReceipt } from '../controllers/receiptController.js';
import { uploadReceipt } from '../store/receiptStorage.js';

const router = express.Router();

/**
 * @swagger
 * /receipt:
 *   post:
 *     summary: Extract total amount from uploaded receipt image
 *     tags:
 *       - Notice
 *     security:
 *       - cookieAuth: []
 */

router.post('/', uploadReceipt.single('receipt'), extractReceipt);

export default router;
