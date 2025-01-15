const pool = require('../../database/db');
const houseQueries = require('../../database/householdQueries');
const logger = require('../../configs/logger');
const { resetHostProps, resetInmatesProps } = require('../../utils/modifyUsersProps');

exports.deleteHouse = async (userId, houseName) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [ownership] = await connection.query(houseQueries.ownershipQuery, [houseName]);

        if (ownership.length === 0) {
            logger.error('Brak uprawnień do usunięcia gospodarstwa.');
            await connection.rollback();
            return { status: 'noperm', message: 'Brak uprawnień do usunięcia gospodarstwa.' };
        };
        const houseId = ownership[0].houseId;
        
        const [result] = await connection.query(houseQueries.deleteQuery, [houseId]);

        if (result.affectedRows == 0) {
            logger.info('Nie znaleziono gospodarstwa.');
            await connection.rollback();
            return { status: 'error', message: 'Nie znaleziono gospodarstwa.' };
        } else if (result.affectedRows == 1) {
            await resetHostProps(userId, connection);

            const [inmates] = await connection.query(houseQueries.selectInmates, [houseId]);
            
            for (const inmate of inmates) {
                const userId = inmate.userId;
                await resetInmatesProps(userId, connection);
            };

            await connection.query(houseQueries.deleteHouseActions, [houseId]);
            logger.info(`Gospodarstwo ${houseName} w pełni usunięte.`);
        };

        await connection.commit();

        return {
            status: 'success',
            message: `Gospodarstwo ${houseName} usunięte.`,
            newRole: 'user'
        };
    } catch (error) {
        logger.error(`Błąd podczas usuwania gospodarstwa: ${error.message}`);
        await connection.rollback();
        return { status: 'error', message: 'Nie udało się usunąć gospodarstwa.' };
    } finally {
        if (connection) connection.release();
    };
};