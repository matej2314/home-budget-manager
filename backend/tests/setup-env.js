/** Secret for JWT in Jest before verifyJWT / WS auth modules load. */
process.env.JWT_SECRET ??= 'test-secret-for-jest';
