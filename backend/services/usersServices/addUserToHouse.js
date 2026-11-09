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

        if (!invitedUser || !houseId) {
            await connection.rollback();
            return { status: 'badreq', message: 'addUserToHouse.invalidInputError' };
        }

        if (role === 'host') {
            const addByHost = await addUserByHost(connection, userName, houseId, invitedUser);

            switch (addByHost.status) {
                case 'badreq':
                    await connection.rollback();
                    return { status: "badreq", message: addByHost.message, };
                case 'error':
                    await connection.rollback();
                    return { status: "error", message: addByHost.message, };
                case 'inmate':
                    await connection.rollback();
                    return { status: "inmate", message: addByHost.message, };
                case 'success':
                    await connection.commit();
                    return { status: 'success', message: addByHost.message };
                default:
                    await connection.rollback();
                    return { status: 'badreq', message: "addUserToHouse.inviteUserInternalError" };
            };
        } else if (role === 'mate') {
            const addByMate = await addUserByMate(connection, userId, invitedUser, houseId, userName, invitingUserName);

            switch (addByMate.status) {
                case "error":
                    await connection.rollback();
                    return { status: 'error', message: addByMate.message };
                case 'inmate':
                    await connection.rollback();
                    return { status: 'inmate', message: addByMate.message };
                case 'badreq':
                    await connection.rollback();
                    return { status: 'badreq', message: addByMate.message };
                case 'success':
                    await connection.commit();
                    return { status: 'success', message: addByMate.message };
                default:
                    await connection.rollback();
                    return { status: 'badreq', message: 'addUserToHouse.inviteUserInternalError' };
            };
        };
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        logger.error(`Error in addUserToHouse: ${error}`);
        return { status: 'error', message: 'addUserToHouse.inviteUserInternalError' };
    } finally {
        connection.release();
    }
};

module.exports = { addUserToHouse };