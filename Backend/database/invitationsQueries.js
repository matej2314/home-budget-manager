module.exports = {
    acceptQuery: 'UPDATE invitations SET status = ? WHERE id = ? AND hostId = ?',
    getInvitationQuery: 'SELECT status, invitingUserId, invitedUserId, houseId, hostId, date FROM invitations WHERE id=?',
    rejectQuery: 'UPDATE invitations SET status=? WHERE id=?',
    invitationsCollectionQuery: `
            SELECT
            i.id AS id,
            i.status AS status,
            i.hostId AS hostId,
            i.invitedUserId AS invitedUser,
            i.invitingUserId AS invitingUser,
            i.date AS date,
            invitingUser.userName AS invitingUserName,
            invitedUser.userName AS invitedUserName
            FROM invitations i 
            LEFT JOIN householdUsers invitingUser ON i.invitingUserId = invitingUser.userId
            LEFT JOIN householdUsers invitedUser ON i.invitedUserId = invitedUser.userId
            WHERE status=?;
            `
}