function isValidPassword(password) {
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[*!#^%$@?])[a-zA-Z\d*!#^%$@?]{10,30}$/;
	return regex.test(password);
};

function isValidEmail(email) {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(email);
};

function isValidUsername(username) {
	const regex = /^[a-zA-Z0-9]{5,}$/;
	return regex.test(username);
};

const allowedRoles = ['superadmin', 'user'];

const registerValidations = (reg_username, reg_email, reg_password, role) => [
	{ isValid: reg_username?.trim().length >= 5 && isValidUsername(reg_username), message: 'Enter correct user data.' },
	{ isValid: reg_email?.trim().length > 0 && isValidEmail(reg_email), message: 'Enter correct e-mail address.' },
	{ isValid: reg_password?.trim().length >= 10 && isValidPassword(reg_password), message: 'Enter correct password.' },
	{ isValid: allowedRoles.includes(role), message: 'Incorrect user role!' },
];

const loginValidations = (email, password) => [
	{ isValid: email && email.trim() !== '', message: 'Enter correct e-mail address.' },
	{ isValid: password && password.trim() !== '', message: 'Enter correct password.' },
];

const validTransactionTypes = ['income', 'expense'];


module.exports = { registerValidations, loginValidations, validTransactionTypes };