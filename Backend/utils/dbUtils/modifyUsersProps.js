const houseQueries = require('../../database/householdQueries');
const logger = require('../../configs/logger');

exports.resetHostProps = async (userId, connection) => {
    await connection.execute(houseQueries.hostQuery, [0, 'user', userId]);
    await connection.execute(houseQueries.updateroleHu, ['user', userId]);
    await connection.execute(houseQueries.updatehouseIdHu, [0, userId]);

    logger.info(`Parametry użytkownik ${userId} zresetowane.`);
};

exports.resetInmatesProps = async (userId, connection) => {
    await connection.execute(houseQueries.mateQuery, [0, 'user', userId]);
    await connection.execute(houseQueries.updateroleHu, ['user', userId]);
    await connection.execute(houseQueries.updatehouseIdHu, [0, userId]);

    logger.info(`Parametry domowników gospodarstwa usunięte.`);
};

exports.setHostProps = async (userId, houseId, connection) => {
    await connection.query(houseQueries.updateroleHu, ['host', userId]);
    await connection.query(houseQueries.updatehouseIdHu, [houseId, userId]);

    logger.info(`Parametry gospodarza ${userId} ustawione.`);
};

exports.setInmateProps = async (userId, existingId, connection) => {
    await connection.query(houseQueries.updateroleHu, ['inmate', userId]);
    await connection.query(houseQueries.updatehouseIdHu, [existingId, userId]);

    logger.info(`Parametry domowników gospodarstwa ${existingId} ustawione.`);
};