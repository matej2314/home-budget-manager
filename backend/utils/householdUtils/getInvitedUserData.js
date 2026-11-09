import usersQueries from '../../database/usersQueries.js';

export const invitedUserData = async (connection, userName) => {

    const [getInvitedUser] = await connection.query(usersQueries.selectUserByName, [userName]);

    return getInvitedUser.length > 0 ? getInvitedUser[0] : null;

};
