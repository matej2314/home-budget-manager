const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const pool = require('../database/db');

const verifyOwner = (houseId) => {
    
    return (req, res, next) => {
        const token = req.cookies.SESSID;
        const inhabitant = req.params.inhabitantId;
        if (!token) {
            return res.status(401).json({ message: 'Zaloguj się, aby zobaczyć zasoby.' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.house = decoded.houseHold;
            req.inhabitant = decoded.inhabitant;

            if (requiredRole && decoded.role !== requiredRole) {
                return res.status(403).json({ message: 'Brak uprawnień' });
            };

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Zaloguj się, aby zobaczyć zasoby.' });
        };
    };
};