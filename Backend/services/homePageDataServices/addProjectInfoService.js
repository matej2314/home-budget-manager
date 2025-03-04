const pool = require('../../database/db');
const logger = require('../../configs/logger');
const { v4: uuidv4 } = require('uuid');

exports.addProjectInfoService = async (title, content) => {
    const connection = await pool.getConnection();

    try {
        const id = uuidv4();
        const [addProjectInfo] = await connection.query('INSERT INTO shortProjectInfo (id, infoTitle, infoContent) VALUES (?,?,?)', [id, title, content]);

        if (addProjectInfo.affectedRows === 0) {
            return { status: 'error', message: 'Failed to add project information.' };
        }
        return { status: 'success', message: `Information about the project with title ${title} added correctly.` };
    } catch (error) {
        logger.error(`addShortProjectInfoService error: ${error}`);
        return { status: 'error', message: 'Internal server error.' };
    };
};
