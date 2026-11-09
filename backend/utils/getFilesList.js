const path = require('path');
const fs = require('fs/promises');
const logger = require('../configs/logger');

exports.getFilesList = async (filesPath) => {

    const filePath = path.join(__dirname, filesPath);

    try {
        const filesList = await fs.readdir(filePath);
        return filesList;
    } catch (error) {
        logger.error(`Failed to read files list. ${error}`);
    }

}