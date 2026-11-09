import pool from '../../database/db.js';
import logger from '../../configs/logger.js';
import { addUserByHost } from '../../utils/householdUtils/addUserByHost.js';
import checkUserHouse from '../../utils/checkUtils/checkUserHouse.js';
import { addUserByMate } from '../../utils/householdUtils/addUserByMate.js';
import { invitedUserData } from '../../utils/householdUtils/getInvitedUserData.js';

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

export { addUserToHouse };
