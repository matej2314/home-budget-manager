const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const logger = require('./logger');

async function extractPhotoData(imagePath) {
    try {
        const processedImagePath = imagePath.replace(/\.\w+$/, '_bw.png');
        await sharp(imagePath)
            .grayscale()
            .toFormat('png')
            .toFile(processedImagePath);
        
        const { data: { text } } = await Tesseract.recognize(processedImagePath, 'eng', {
            logger: m => logger.info(m)
        });

        const match = text.match(/SUMA[\s:]*\s*(PLN)?[\s:]*([\d.,]+)/i);
        const totalAmount = match ? match[2] : null;

        logger.info(`Odczytana suma: ${totalAmount}`);
        return totalAmount;
    } catch (error) {
        logger.error(`Błąd OCR: ${error}`);
        return null;
    };
};

module.exports = { extractPhotoData }; 