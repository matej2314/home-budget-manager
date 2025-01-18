const checkUserEmail = async (connection, reg_email) => {
    const [result] = await connection.query('SELECT * FROM users WHERE email = ?', [reg_email]);
    return result.length > 0 ? result[0] : null;
};

module.exports = { checkUserEmail };