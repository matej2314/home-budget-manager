const houseQueries = require('../../database/householdQueries');
const logger = require('../../configs/logger');

exports.resetHostProps = async (userId, connection) => {
    await connection.execute(houseQueries.hostQuery, [0, 'user', userId]);
    await connection.execute(houseQueries.updateroleHu, ['user', userId]);
    await connection.execute(houseQueries.updatehouseIdHu, [0, userId]);

    logger.info(`Parameters of user ${userId} reseted.`);
};

exports.resetInmatesProps = async (userId, connection) => {
    await connection.execute(houseQueries.mateQuery, [0, 'user', userId]);
    await connection.execute(houseQueries.updateroleHu, ['user', userId]);
    await connection.execute(houseQueries.updatehouseIdHu, [0, userId]);

    logger.info(`Parameters of housemates deleted.`);
};

exports.setHostProps = async (userId, houseId, connection) => {
    await connection.query(houseQueries.updateroleHu, ['host', userId]);
    await connection.query(houseQueries.updatehouseIdHu, [houseId, userId]);

    logger.info(`Parameters of host ${userId} set.`);
};

exports.setInmateProps = async (userId, existingId, connection) => {
    await connection.query(houseQueries.updateroleHu, ['inmate', userId]);
    await connection.query(houseQueries.updatehouseIdHu, [existingId, userId]);

    logger.info(`Parameters of housemates of household ${existingId} set.`);
};