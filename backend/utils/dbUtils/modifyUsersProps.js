import houseQueries from '../../database/householdQueries.js';
import logger from '../../configs/logger.js';

export const resetHostProps = async (userId, connection) => {
    await connection.execute(houseQueries.hostQuery, [0, 'user', userId]);
    await connection.execute(houseQueries.updateroleHu, ['user', userId]);
    await connection.execute(houseQueries.updatehouseIdHu, [0, userId]);

    logger.info(`Parameters of user ${userId} reseted.`);
};

export const resetInmatesProps = async (userId, connection) => {
    await connection.execute(houseQueries.mateQuery, [0, 'user', userId]);
    await connection.execute(houseQueries.updateroleHu, ['user', userId]);
    await connection.execute(houseQueries.updatehouseIdHu, [0, userId]);

    logger.info(`Parameters of housemates deleted.`);
};

export const setHostProps = async (userId, houseId, connection) => {
    await connection.query(houseQueries.updateroleHu, ['host', userId]);
    await connection.query(houseQueries.updatehouseIdHu, [houseId, userId]);

    logger.info(`Parameters of host ${userId} set.`);
};

export const setInmateProps = async (userId, existingId, connection) => {
    await connection.query(houseQueries.updateroleHu, ['inmate', userId]);
    await connection.query(houseQueries.updatehouseIdHu, [existingId, userId]);

    logger.info(`Parameters of housemates of household ${existingId} set.`);
};
