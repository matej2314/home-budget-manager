const logger = require('../../configs/logger');

const checkTransaction = async (connection, transactionId) => {

    try {
        const [result] = await connection.query('SELECT userId, value FROM transactions WHERE transactionId=? ', [transactionId]);

        if (result.length > 0) {
            return result[0];
        };
        return false;
    } catch (error) {
        logger.error(`checkTransaction error: ${error.message}`);
        return false;
    }

};

module.exports = { checkTransaction };