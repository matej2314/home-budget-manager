const pool = require('../../database/db');
const logger = require('../../configs/logger');
const houseQueries = require('../../database/householdQueries');

const deleteInhabitant = async (inhabitantId) => {

    if (!inhabitantId) {
        return {
            status: 'badreq',
            message: 'Brak wymaganych danych: inhabitantId.',
        };
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [deleteHouseIdHu] = await connection.query(
            houseQueries.updatehouseIdHu,
            [0, inhabitantId]
        );

        if (deleteHouseIdHu.affectedRows !== 1) {
            logger.error(`Nie udało się zaktualizować houseId użytkownika: ${inhabitantId}`);
        }

        const [changeRoleHu] = await connection.query(
            houseQueries.updateroleHu,
            ['user', inhabitantId]
        );

        if (changeRoleHu.affectedRows !== 1) {
            logger.error(`Nie udało się zmienić roli użytkownika: ${inhabitantId}`);
        }

        await connection.query(
            houseQueries.mateQuery,
            [0, 'user', inhabitantId]
        );

        await connection.commit();

        return {
            status: 'success',
            message: 'Domownik został pomyślnie usunięty.',
        };
    } catch (error) {
        await connection.rollback();
        logger.error(`Nie udało się usunąć domownika: ${error.message}`);
        return {
            status: 'error',
            message: 'Nie udało się usunąć domownika.',
        };
    } finally {
        connection.release();
    }
};

module.exports = { deleteInhabitant };