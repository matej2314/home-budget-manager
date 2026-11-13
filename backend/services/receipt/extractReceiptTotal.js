import { extractPhotoData } from '../../configs/tesseract.js';
import { AppError } from '../../utils/errors/AppError.js';
import logger from '../../configs/logger.js';

export async function extractReceiptTotal(fileBuffer) {
  if (!fileBuffer) {
    throw new AppError({
      code: 'RECEIPT_NO_FILE',
      messageKey: 'Upload correct file.',
      httpStatus: 400,
    });
  }

  try {
    const totalAmount = await extractPhotoData(fileBuffer);
    if (!totalAmount) {
      throw new AppError({
        code: 'RECEIPT_OCR_INVALID',
        messageKey: 'addTransaction.invalidRecognizeInput',
        httpStatus: 400,
      });
    }
    return { messageKey: 'Receipt recognized.', value: totalAmount };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error(`Image processing error: ${error}`);
    throw new AppError({
      code: 'RECEIPT_OCR_INTERNAL',
      messageKey: 'addTransaction.recognizeInternalError',
      httpStatus: 500,
    });
  }
}
