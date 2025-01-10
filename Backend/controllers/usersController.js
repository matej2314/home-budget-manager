const pool = require('../database/db');
const logger = require('../configs/logger');
const usersQueries = require('../database/usersQueries');

exports.getAllUsers = async (req, res) => {

    const connection = await pool.getConnection();

    try {
        const [rows] = await pool.query(usersQueries.allUsersQuery);
        logger.info('Lista wszystkich użytkowników pobrana poprawnie.');
        return res.status(200).json({
            status: 'success',
            message: 'Lista wszystkich użytkowników pobrana poprawnie',
            users: rows,
        });

    } catch (error) {
        logger.error(`Błąd podczas pobierania listy użytkowników: ${error}`);
        return res.status(500).json({ status: 'error', mesage: 'Bląd pobierania listy użytkowników' });
    } finally {
        connection.release();
    }
};

exports.getInhabitants = async (req, res) => {
    const houseId = req.house;
 
    const connection = await pool.getConnection();

    try {
        const [rows] = await pool.query(usersQueries.inhabitantsQuery, [houseId]);
        logger.info(`Lista domowników gospodarstwa ${houseId} pobrana poprawnie`);
        return res.status(200).json({
            status: 'success',
            message: `Lista domowników gospodarstwa ${houseId} pobrana poprawnie`,
            users: rows,
        });

    } catch (error) {
        logger.error(`Nie udało się pobrać listy domowników gospodarstwa ${houseId}`);
        return res.status(500).json({
            status: 'error',
            message: 'Nie udało się pobrać listy domowników gospodarstwa.',
        });
    } finally {
        connection.release();
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.userId;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [householdResult] = await connection.query(usersQueries.checkHousehold, [userId]);
        if (householdResult.length > 0) {
            const householdId = householdResult[0].household_id;

            await connection.query(usersQueries.deleteHouse, [householdId]);
            logger.info(`Gospodarstwo użytkownika ${userId} (ID: ${householdId}) usunięte.`);
        } else {
            logger.info(`Użytkownik ${userId} nie ma przypisanego gospodarstwa.`);
        }

        await connection.query(usersQueries.delUserQuery, [userId]);
        logger.info(`Użytkownik ${userId} usunięty poprawnie.`);

        await connection.commit();

        return res.status(200).json({ status: 'success', message: 'Użytkownik usunięty poprawnie.' });

    } catch (error) {

        await connection.rollback();

        logger.error(`Błąd podczas usuwania użytkownika ${userId}: ${error.message}`);
        return res.status(500).json({ status: 'error', message: 'Błąd serwera.' });

    } finally {
        connection.release();
    }
};

exports.deleteInhabitant = async (req, res) => {
    const house = req.house;
    const { inhabitantId } = req.body;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [checkInhabitant] = await connection.query(usersQueries.checkQuery, [inhabitantId]);

        if (checkInhabitant.length === 0) {
            await connection.rollback();
            logger.info('Użytkownik nie jest domownikiem.');
            return res.status(404).json({ status: 'error', message: 'Użytkownik nie jest domownikiem.' });
        }

        const { inhabitant } = checkInhabitant[0];

        if (inhabitant !== house) {
            await connection.rollback();
            logger.info(`Użytkownik ${inhabitantId} nie należy do gospodarstwa ${house}.`);
            return res.status(403).json({
                status: 'error',
                message: 'Nie masz uprawnień do usunięcia tego użytkownika.',
            });
        }

        await connection.query(usersQueries.deleteQuery, [inhabitantId]);
        await connection.commit();

        logger.info(`Domownik ${inhabitantId} został usunięty z gospodarstwa ${house}.`);
        return res.status(200).json({
            status: 'success',
            message: `Domownik ${inhabitantId} został usunięty poprawnie.`,
        });
    } catch (error) {
        logger.error(`Nie udało się usunąć domownika: ${error}`);
        await connection.rollback();
        return res.status(500).json({
            status: 'error',
            message: 'Nie udało się usunąć domownika.',
        });
    } finally {
        connection.release();
    }
};
