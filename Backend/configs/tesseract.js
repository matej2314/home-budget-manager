const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const logger = require('./logger');

async function extractPhotoData(imageBuffer) {
    try {
        const processedImageBuffer = await sharp(imageBuffer)
            .grayscale()
            .toFormat('png')
            .toBuffer();

        const { data: { text } } = await Tesseract.recognize(processedImageBuffer, 'pol', {
            logger: m => logger.info(m)
        });

        logger.info(`Wykryty tekst: ${text}`);
        const match = text.match(/(?:SUMA|DO\sZAPŁATY)[\s:]*\s*(PLN)?[\s:]*([\d.,]+)/i);
        const totalAmount = match ? match[2] : null;

        logger.info(`Odczytana suma: ${totalAmount}`);
        return totalAmount;
    } catch (error) {
        logger.error(`Błąd OCR: ${error}`);
        return null;
    }
}

module.exports = { extractPhotoData };
