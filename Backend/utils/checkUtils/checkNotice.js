const checkNotice = async (noticeId, connection) => {
    const [result] = await connection.query('SELECT id from notifications WHERE id=?', [noticeId]);

    return result.length > 0 ? result[0] : null;
};

module.exports = { checkNotice };