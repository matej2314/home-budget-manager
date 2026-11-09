module.exports = {
    registerEmailCheck: 'SELECT * FROM users WHERE email=?',
    registerAdminCheck: 'SELECT * FROM users WHERE role = "superadmin" LIMIT 1',
    register: 'INSERT INTO users SET ?',
    login: 'SELECT * FROM users WHERE email = ?',
    houseUsers: 'INSERT INTO householdUsers SET ?',
};