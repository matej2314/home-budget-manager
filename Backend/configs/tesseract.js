const tesseract = require('tesseract.js');
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

        const match = text.match(/SUMA[:\s]*([\d.,]+)/i);
        return match ? match[1] : null;

    } catch (error) {
        logger.error(`Błąd OCR: ${error}`);
        return null;
    };
};

module.exports = { extractPhotoData };