const usersQueries = require('../../database/usersQueries');

exports.invitedUserData = async (connection, userName) => {

    const [getInvitedUser] = await connection.query(usersQueries.selectUserByName, [userName]);

    return getInvitedUser.length > 0 ? getInvitedUser[0] : null;

};