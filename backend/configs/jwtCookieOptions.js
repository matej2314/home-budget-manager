const jwtCookieOptions = {
	httpOnly: true,
	// Supertest (HTTP) nie trzyma cookie z Secure — w NODE_ENV=test wyłączamy (T-5 E2E).
	secure: process.env.NODE_ENV !== 'test',
	sameSite: 'lax',
};

export default jwtCookieOptions;
