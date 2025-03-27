const logger = require('../../configs/logger');

export const saveNewHousemate = async (usersQueries, invitedUserId, hostHouseId, connection) => {

    try {
        const [addMate] = await connection.query(usersQueries.mateQuery, [1, 'mate', invitedUserId]);
        if (addMate.affectedRows == 1) {

            const [updateHouseId] = await connection.query(usersQueries.updatehouseIdHu, [hostHouseId, invitedUserId]);

            if (updateHouseId.affectedRows == 1) {
                await connection.query(usersQueries.updateroleHu, ['mate', invitedUserId]);
            }
        };
    } catch (error) {
        logger.error(`error in saveNewHousemate: ${error}`);
    }
}