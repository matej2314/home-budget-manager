const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const pool = require('../database/db');
const logger = require('../configs/logger');

router.post('/new', async (req, res) => {
    const { name, type } = req.body;
    const id = uuidv4();

    const connection = await pool.getConnection();

    try {
        if (!name || !name.trim() || !type || !type.trim()) {
            logger.error(`Brak danych do dodania kategorii transakcji.`);
            return res.status(400).json({
                status: 'error',
                message: 'Brak wymaganych danych.',
            });
    }
    
        const query = 'INSERT INTO actionCategories (id, name, type) VALUES (?, ?, ?)';
    
        const addCat = await connection.query(query, [id, name, type]);
    
        if (addCat.affectedRows == 0) {
            logger.error(`Nie udało się dodać kategorii transakcji ${name}`);
            return res.status(400).json({ status: 'error', message: 'Nie udało się dodać nowej kategorii transakcji.' });
        };
    
        return res.status(200).json({
            status: 'success',
            message: `Kategoria transakcji ${name} dodana poprawnie.`,
            catId: id,
        });

    } catch (error) {
        logger.error(`Błąd w actioncat/new: ${error}`);
        return res.status(500).json({
            status: 'error',
            message: 'Błąd dodawania nowej kategorii transakcji',
        });

    } finally {
        if (connection) connection.release();
}
    
});

router.get('/collection', async (req, res) => {

    const query = 'SELECT * FROM actionCategories ORDER BY id';
    const connection = await pool.getConnection();

    try {
        const [categories] = await connection.query(query);

        if (categories.length == 0) {
            logger.error('Nie znaleziono kategorii transakcji w bazie danych.');
            return res.status(404).json({
                status: 'error',
                message: 'Nie znaleziono kategorii transakcji.',
            });
        };

        return res.status(200).json({
            status: 'success',
            message: 'Kategorie transakcji pobrane poprawnie.',
            actionCategories: categories,
        });

    } catch (error) {
        logger.error('Nie udało się pobrać kategorii transakcji.', error);
        return res.status(500).json({
            status: 'error',
            message: 'Błąd przetwarzania żądania.',
        });
    } finally {
        if (connection) connection.release();
    }
});

router.delete('/delete', async (req, res) => {
    const { catName } = req.body;
    const connection = await pool.getConnection();

    if (!catName || !catName.trim()) {
        logger.error('Brak nazwy kategorii do usunięcia.');
        return res.status(400).json({
            status: 'error',
            message: 'Podaj poprawne dane dotyczące kategorii.',
        });
    };

    const query = 'DELETE FROM actionCategories WHERE name=?';
    
    try {
        const [result] = await connection.query(query, [catName]);

        if (result.affectedRows == 0) {
            logger.info(`Nie udało się usunąć kategorii transakcji ${catName}`);
            return res.status(404).json({ status: 'error', message: 'Nie udało się usunąć kategorii transakcji.' });
        };

        return res.status(200).json({
            status: 'success',
            message: `Kategoria transakcji ${catName} usunięta poprawnie.`,
        });

    } catch (error) {
        logger.error(`Błąd w /actioncat/delete: ${error}`);
        return res.status(500).json({
            status: 'error',
            message: `Błąd przetwarzania żądania.`,
        });
    } finally {
     if (connection) connection.release();
    }
});

module.exports = router;