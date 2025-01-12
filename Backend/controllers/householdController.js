const pool = require('../database/db');
const { v4: uuidv4 } = require('uuid');
const logger = require('../configs/logger');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const jwtCookieOptions = require('../configs/jwtCookieOptions');
const houseQueries = require('../database/householdQueries');

exports.addNewHouse = async (req, res) => {
    const userId = req.userId;
    const userName = req.userName;
    const { houseName } = req.body;

    if (!userId || !houseName) {
        logger.error('Brak danych: userId lub houseName są puste.');
        return res.status(400).json({ status: 'error', message: 'Podaj wszystkie niezbędne informacje.' });
    }

    const houseId = uuidv4();
    
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [existingHouse] = await connection.query(houseQueries.checkQuery, [houseName]);
       
        if (existingHouse.length > 0) {
            const existingId = existingHouse[0].houseId;
            
            try {
                const [addmate] = await connection.query(houseQueries.mateQuery, [1, 'inmate', userId]);
                
                if (addmate.affectedRows === 1) {
                    await connection.query(houseQueries.updateroleHu, ['inmate', userId]);
                    await connection.query(houseQueries.updatehouseIdHu, [existingId, userId]);
                };

                logger.info(`Gospodarstwo ${houseName} istnieje. Użytkownik dodany jako domownik.`);

                await connection.commit();

                return res.status(200).json({ status: 'success', message: `Użytkownik został dodany do gospodarstwa ${houseName}.` });

            } catch (error) {
                await connection.rollback();
                logger.error(`Błąd przy dodawaniu użytkownika jako domownika: ${error}`);
                return res.status(500).json({ status: 'error', message: 'Błąd przy dodawaniu użytkownika do gospodarstwa.' });
            };

        } else if (existingHouse.length === 0) {

            try {
                
                const [addHouse] = await connection.query(houseQueries.addQuery, [houseId, userId, userName, houseName]);
                
                if (addHouse.affectedRows === 1) {
                    const [addHost] = await connection.query(houseQueries.hostQuery, [1, 'host', userId]);

                    if (addHost.affectedRows === 1) {
                        await connection.query(houseQueries.updateroleHu, ['host', userId]);
                    }
                };

                await connection.commit();
                logger.info(`Nowe gospodarstwo ${houseName} zostało utworzone.`);
                return res.status(201).json({ status: 'success', message: `Gospodarstwo ${houseName} zostało utworzone.` });
            } catch (error) {
                await connection.rollback();
                logger.error(`Błąd przy tworzeniu gospodarstwa: ${error}`);
                return res.status(500).json({ status: 'error', message: 'Błąd przy tworzeniu gospodarstwa.' });
            }
        }

    } catch (error) {
        await connection.rollback();
        logger.error(`Błąd przy dodawaniu nowego gospodarstwa: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Wystąpił błąd podczas przetwarzania żądania.' });
    } finally {
        connection.release();
    }
};

exports.getAllHouses = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const [result] = await connection.execute(houseQueries.getAllHousesQuery);

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
    
    if (!userId) {
        logger.error('Brak danych do pobrania informacji o gospodarstwie.');
        return res.status(400).json({ status: 'error', message: 'Brak poprawnych informacji.' });
    }

    const connection = await pool.getConnection();

    try {
        const [gethouseId] = await connection.query('SELECT houseId FROM householdUsers WHERE userId =?', [userId]);
       
        if (gethouseId.length === 0) {
            logger.error('Użytkownik nie zarządza gospodarstwem.');
            return res.status(404).json({ status: 'error', message: 'Użytkownik nie zarządza gospodarstwem.' });
        } else {
            const householdId = gethouseId[0].houseId;
           
            const [result] = await connection.execute(houseQueries.dataQuery, [householdId]);

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
        };

    } catch (error) {
        logger.error(`Błąd podczas pobierania informacji o gospodarstwie: ${error.stack}`);
        return res.status(500).json({ status: 'error', message: 'Nie udało się pobrać danych o gospodarstwie.' });
    } finally {
        connection.release();
    }
};


/// powyżej gotowe
exports.deleteHouse = async (req, res) => {
    const userId = req.userId;
    const { houseName } = req.body;

    if ( !userId || !houseName) {
        logger.error('Podaj prawidłowe dane do usunięcia gospodarstwa.');
        return res.status(400).json({ status: 'error', message: 'Podaj prawidłowe dane do usunięcia gospodarstwa.' });
    };

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [ownership] = await connection.query(houseQueries.ownershipQuery, [userId, houseName]);

        if (ownership.length === 0 ) {
            logger.error('Brak uprawnień do usunięcia gospodarstwa.');
            await connection.rollback();
            return res.status(403).json({ status: 'error', message: 'Brak uprawnień do usunięcia gospodarstwa.' });
        };
        const houseId = ownership[0].houseId;
        

    //   const [inmates] = await connection.query('SELECT userId FROM householdUsers WHERE houseId=?', [houseId]);


        const [result] = await connection.query(houseQueries.deleteQuery, [houseId, userId]);

        if (result.affectedRows == 0) {
            logger.info('Nie znaleziono gospodarstwa.');
            await connection.rollback();
            return res.status(404).json({ status: 'error', message: 'Nie znaleziono gospodarstwa.' });
        } else if (result.affectedRows == 1) {
            await connection.query(houseQueries.hostQuery, [0, 'user', userId]);
            await connection.query(houseQueries.updateroleHu, ['user', userId]);
        };

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