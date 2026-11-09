import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import logger from '../configs/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getFilesList = async (filesPath) => {

    const filePath = path.join(__dirname, filesPath);

    try {
        const filesList = await fs.readdir(filePath);
        return filesList;
    } catch (error) {
        logger.error(`Failed to read files list. ${error}`);
    }

}
