const jwtCookieOptions = {
	httpOnly: true,
	secure: false,
	sameSite: 'none',
};

module.exports = jwtCookieOptions;
