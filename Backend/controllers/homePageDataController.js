const pool = require('../database/db');
const logger = require('../configs/logger');
const { v4: uuidv4 } = require('uuid');

exports.getDataCollection = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        let homePageData = {};

        const [getFunctionalities] = await connection.query('SELECT id, functionTitle, functionContent FROM functionalities');

        homePageData.functionalities = getFunctionalities;

        const [getShortInfo] = await connection.query('SELECT id, infoTitle, infoContent FROM shortProjectInfo');
        homePageData.shortInfo = getShortInfo;

        const [getReviews] = await connection.query('SELECT id, rating,userName, content, userId, date FROM usersReviews');
        homePageData.reviews = getReviews;

        await connection.commit();

        return res.status(200).json({
            status: 'success',
            message: 'Dane pobrane poprawnie.',
            homePageData
        });

    } catch (error) {
        await connection.rollback();
        logger.error(`Błąd w getDataCollection: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    } finally {
        if (connection) connection.release();
    }
};

exports.addFunctionality = async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ status: 'error', message: 'Podaj szczegóły funkcjonalności!' });
    };

    const connection = await pool.getConnection();

    try {
        const id = uuidv4();

        const addFunctionality = connection.query('INSERT INTO functionalities (id, functiontitle, functionContent) VALUES (?,?,?)', [id, title, content]);

        if (addFunctionality.affectedRows === 0) {
            return res.status(500).json({ status: 'error', message: 'Nie udało się dodać funkcjonalności.' });
        };
        return res.status(201).json({ status: 'success', message: `Dodano funkcjonalność ${title}` });
    } catch (error) {
        logger.error(`Błąd w addFunctionality: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    }
};

exports.addShortProjectInfo = async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({status: 'error', message: 'Podaj szczegóły informacji!'})
    };

    const connection = await pool.getConnection();

    try {
        const id = uuidv4();
        const [addProjectInfo] = await connection.query('INSERT INTO shortProjectInfo (id, infoTitle, infoContent) VALUES (?,?,?)', [id, title, content]);

        if (addProjectInfo.affectedRows === 0) {
            return res.status(500).json({ status: 'error', message: 'Nie udało się dodać informacji.' });
        }
        return res.status(201).json({ status: 'success', message: `Informacja o tytule ${title} dodana.` });
    } catch (error) {
        logger.error(`Błąd w addShortProjectInfo: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przetwarzania żądania.' });
    };
};