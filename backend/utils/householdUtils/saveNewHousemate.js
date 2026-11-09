const logger = require('../../configs/logger');

exports.saveNewHousemate = async (usersQueries, invitedUserId, hostHouseId, connection) => {

    try {
        const [addMate] = await connection.query(usersQueries.mateQuery, [1, 'mate', invitedUserId]);
        if (addMate.affectedRows == 1) {

            const [updateHouseId] = await connection.query(usersQueries.updatehouseIdHu, [hostHouseId, invitedUserId]);

            await connection.query(usersQueries.updateroleHu, ['mate', invitedUserId]);
        };
        return { status: 'success', invitedUserId }
    } catch (error) {
        logger.error(`error in saveNewHousemate: ${error.message || error}`);
        return { status: 'error', error };
    }
};