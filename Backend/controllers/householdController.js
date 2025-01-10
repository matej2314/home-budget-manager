const pool = require('../database/db');
const { v4: uuidv4 } = require('uuid');
const logger = require('../configs/logger');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const jwtCookieOptions = require('../configs/jwtCookieOptions');
const houseQueries = require('../database/householdQueries');


exports.addNewHouse = async (req, res) => {
    const userId = req.userId;
    const { houseName } = req.body;

    if (!userId || !houseName) {
        logger.error('Brak danych: userId lub houseName są puste.');
        return res.status(400).json({ status: 'error', message: 'Podaj wszystkie niezbędne informacje.' });
    }

    const houseId = uuidv4();
    
    let houseToToken;
    let existingHouseId;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [results] = await connection.query(houseQueries.checkQuery, [houseName]);

        if (results.length > 0) {
            existingHouseId = results[0].houseId;

            await connection.query(houseQueries.mateQuery, [existingHouseId, userId]);

            houseToToken = existingHouseId;
            logger.info(`Gospodarstwo ${houseName} już istnieje. Dodano domownika.`);
        } else {
            await connection.query(houseQueries.addQuery, [houseId, userId, houseName]);

            houseToToken = houseId;
            logger.info(`Gospodarstwo ${houseName} dodane poprawnie.`);
        }

        await connection.commit();

        const token = jwt.sign(
            {
                id: userId,
                role: req.role,
                userName: req.userName,
                houseHold: houseToToken === houseId ? houseId : null,
                inhabitant: houseToToken === existingHouseId ? existingHouseId : null,
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.cookie('SESSID', token, {
            ...jwtCookieOptions,
            maxAge: 86400000,
        });

        return res.status(200).json({
            status: 'success',
            message:
                houseToToken === houseId
                    ? `Gospodarstwo ${houseName} dodane poprawnie.`
                    : `Gospodarstwo ${houseName} już istnieje. Dodano domownika.`,
            houseId: houseToToken,
        });

    } catch (error) {
        await connection.rollback();

        logger.error(`Błąd podczas przetwarzania żądania: ${error}`);
        return res.status(500).json({
            status: 'error',
            message: 'Błąd podczas przetwarzania żądania.',
        });
    } finally {
        connection.release();
    }
};

exports.getAllHouses = async (req, res) => {
    const query = 'SELECT houseId, houseName, ownerId FROM households ORDER BY houseId';
    const connection = await pool.getConnection();

    try {
        const [result] = await connection.query(query);

        if (result.length === 0) {
            logger.info('Brak gospodarstw.');
            return res.status(404).json({ status: 'error', message: 'Brak gospodarstw.' });
        }

        logger.info('Gospodarstwa pobrane poprawnie.');
        return res.status(200).json({
            status: 'success',
            message: 'Gospodarstwa pobrane poprawnie.',
            houses: result,
        });
    } catch (error) {
        logger.error(`Błąd podczas pobierania gospodarstw: ${error.stack}`);
        return res.status(500).json({ status: 'error', message: 'Błąd podczas pobierania gospodarstw.' });
    } finally {
        connection.release();
    }
};

exports.getHouseInfo = async (req, res) => {
    const userId = req.userId;
    const householdId = req.house;

    if (!userId || !householdId) {
        logger.error('Brak danych do pobrania informacji o gospodarstwie.');
        return res.status(400).json({ status: 'error', message: 'Brak poprawnych informacji.' });
    }

    const connection = await pool.getConnection();

    try {
        const [result] = await connection.query(houseQueries.dataQuery, [householdId, userId]);

        if (result.length === 0) {
            logger.error('Nie znaleziono gospodarstwa.');
            return res.status(404).json({ status: 'error', message: 'Nie znaleziono gospodarstwa.' });
        }

        logger.info(`Informacje o gospodarstwie ${householdId} pobrane poprawnie.`);
        return res.status(200).json({
            status: 'success',
            message: 'Informacje o gospodarstwie pobrane poprawnie.',
            info: result,
        });
    } catch (error) {
        logger.error(`Błąd podczas pobierania informacji o gospodarstwie: ${error.stack}`);
        return res.status(500).json({ status: 'error', message: 'Nie udało się pobrać danych o gospodarstwie.' });
    } finally {
        connection.release();
    }
};

exports.deleteHouse = async (req, res) => {
    const houseId = req.house;
    const userId = req.userId;
    const { houseName } = req.body;

    if (!houseId || !userId || !houseName) {
        logger.error('Podaj prawidłowe dane do usunięcia gospodarstwa.');
        return res.status(400).json({ status: 'error', message: 'Podaj prawidłowe dane do usunięcia gospodarstwa.' });
    };

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [ownership] = await connection.query(houseQueries.ownershipQuery, [houseId]);

        if (ownership.length === 0 || ownership[0].ownerId !== userId) {
            logger.error('Brak uprawnień do usunięcia gospodarstwa.');
            await connection.rollback();
            return res.status(403).json({ status: 'error', message: 'Brak uprawnień do usunięcia gospodarstwa.' });
        }

        const [result] = await connection.query(houseQueries.deleteQuery, [houseId, userId]);

        if (result.affectedRows == 0) {
            logger.info('Nie znaleziono gospodarstwa.');
            await connection.rollback();
            return res.status(404).json({ status: 'error', message: 'Nie znaleziono gospodarstwa.' });
        }

        await connection.commit();

        return res.status(200).json({
            status: 'success',
            message: `Gospodarstwo ${houseName} usunięte.`,
        });
    } catch (error) {
        logger.error(`Błąd podczas usuwania gospodarstwa: ${error.message}`);
        await connection.rollback();
        return res.status(500).json({ status: 'error', message: 'Nie udało się usunąć gospodarstwa.' });
    } finally {
        connection.release();
    }
};