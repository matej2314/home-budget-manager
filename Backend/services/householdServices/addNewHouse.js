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

            const [addmate] = await connection.query(houseQueries.mateQuery, [1, 'mate', userId]);

            if (addmate.affectedRows === 1) {
                setInmateProps(userId, existingId, connection);
            }

            logger.info(`Household ${houseName} already exists. User attributed as housemate.`);

            await connection.commit();
            return {
                status: 'success',
                message: `User addedd to household ${houseName}.`,
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
            logger.info(`New household ${houseName} created.`);
            return {
                status: 'success',
                message: `Household ${houseName} created.`,
                newRole: 'host',
            };
        }
    } catch (error) {
        await connection.rollback();
        logger.error(`Error adding new household: ${error.message}`);
        return { status: 'error', message: 'Internal server error.' };
    } finally {
        if (connection) connection.release();
    }
};


module.exports = { addNewHouse };