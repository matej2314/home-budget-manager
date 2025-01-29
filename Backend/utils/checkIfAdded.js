const logger = require('../configs/logger');

const checkIfAdded = async (connection, transactionId, userId) => {

    try {
        const [result] = await connection.query('SELECT userId from transactions WHERE transactionId=? ', [transactionId]);

        if (result.length > 0 && result[0].userId === userId) {
            return true;
        };
        return false;
    } catch (error) {
        logger.error(`Błąd w checkIfAdded: ${error.message}`);
        return false;
    }
    
};

module.exports = { checkIfAdded };