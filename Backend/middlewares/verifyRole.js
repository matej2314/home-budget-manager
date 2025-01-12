const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const verifyRole = (reqRole) => {
    return (req, res, next) => {
        const token = req.cookies.SESSID;

        if (!token) {
            return res.status(403).json({ status: 'error', message: 'Błąd autoryzacji.' });
        };

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const role = decoded.role;
            const userId = decoded.id;

            if (role !== reqRole) {
                logger.error(`Użytkownik ${userId} nie ma uprawnień dostępu.`);
                return res.status(403).json({ status: 'error', message: 'Nie masz uprawnień dostępu.' });
            } else {
                next();
            }
        } catch (error) {
            return res.status(401).json({ status: 'error', message: 'Błąd autoryzacji' });
        };
    };
};

module.exports = verifyRole;