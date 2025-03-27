const pool = require('../../database/db');
const logger = require('../../configs/logger');
const { addUserByHost } = require('../../utils/householdUtils/addUserByHost');
const checkUserHouse = require('../../utils/checkUtils/checkUserHouse');
const { addUserByMate } = require('../../utils/householdUtils/addUserByMate');
const { invitedUserData } = require('../../utils/householdUtils/getInvitedUserData');

const addUserToHouse = async (userId, userName, invitingUserName, role) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const invitedUser = await invitedUserData(connection, userName);
        const getHouseId = await checkUserHouse(connection, userId);
        const houseId = getHouseId.houseId;

        if (role === 'host') {
            await addUserByHost(connection, userName, houseId, invitedUser);
        } else if (role === 'mate') {
            await addUserByMate(connection, userId, invitedUser, houseId, userName, invitingUserName);
        }

    } catch (error) {
        logger.error(`Error in addUserToHouse: ${error}`);
    }
};

module.exports = { addUserToHouse };