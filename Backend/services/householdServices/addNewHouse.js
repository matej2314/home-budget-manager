const pool = require('../../database/db');
const logger = require('../../configs/logger');
const { v4: uuidv4 } = require('uuid');
const houseQueries = require('../../database/householdQueries');
const { setHostProps, setInmateProps } = require('../../utils/dbUtils/modifyUsersProps');



const addNewHouse = async (userId, userName, houseName, initBudget) => {
    const houseId = uuidv4();
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [existingHouse] = await connection.query(houseQueries.checkQuery, [houseName]);

        if (existingHouse.length > 0) {
            const existingId = existingHouse[0].houseId;

            const [addmate] = await connection.query(houseQueries.mateQuery, [1, 'inmate', userId]);

            if (addmate.affectedRows === 1) {
                setInmateProps(userId, existingId, connection);
            }

            logger.info(`Gospodarstwo ${houseName} istnieje. Użytkownik dodany jako domownik.`);

            await connection.commit();
            return {
                status: 'success',
                message: `Użytkownik został dodany do gospodarstwa ${houseName}.`,
                newRole: 'inmate',
            };

        } else {
            const [addHouse] = await connection.query(houseQueries.addQuery, [houseId, userId, userName, houseName, initBudget]);

            if (addHouse.affectedRows === 1) {
                const [addHost] = await connection.query(houseQueries.hostQuery, [1, 'host', userId]);

                if (addHost.affectedRows === 1) {
                    await setHostProps(userId, houseId, connection);
                }
            }

            await connection.commit();
            logger.info(`Nowe gospodarstwo ${houseName} zostało utworzone.`);
            return {
                status: 'success',
                message: `Gospodarstwo ${houseName} zostało utworzone.`,
                newRole: 'host',
            };
        }
    } catch (error) {
        await connection.rollback();
        logger.error(`Błąd przy dodawaniu nowego gospodarstwa: ${error.message}`);
        return { status: 'error', message: 'Wystąpił błąd podczas przetwarzania żądania.' };
    } finally {
        if (connection) connection.release();
    }
};


module.exports = { addNewHouse };