const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const logger = require('../configs/logger');
const { v4: uuidv4 } = require('uuid');
const verifyJWT = require('../middlewares/verifyJWT');

router.post('/send', verifyJWT(), async (req, res) => {
    const { recipientId, content } = req.body;
    const senderId = req.userId;

    if (!senderId || !recipientId || !content) {
        return res.status(404).json({
            status: 'error',
            message: 'Podaj konieczne dane, aby wysłać wiadomość.',
        });
    };
    const id = uuidv4();
    const connection = await pool.getConnection();

    try {
        const [result] = await connection.query('INSERT INTO messages (id, senderId, recipientId, content) VALUES (? ,? ,?,?)',
            [id, senderId, recipientId, content]
        );
        logger.info(`Message: ${id} sent`);
        return res.status(201).json({ status: 'success', message: 'Message sent', messageId: id });
 
    } catch (error) {
        logger.error(`Błąd przy wysyłaniu wiadomości : ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd serwera.' });
    } finally {

     if(connection) connection.release();
    };
});

router.get('/receive', verifyJWT(), async (req, res) => {

    const  userId  = req.userId;
    const connection = await pool.getConnection();

    try {
        const [messages] = await connection.query('SELECT * FROM messages WHERE recipientId =? ORDER BY datetime ASC',
            [userId, userId]);
        
        logger.info(`Użytkownik ${userId} pobrał wiadomości.`);
        return res.status(200).json({ status: 'success', message: 'Pobrano wiadomości', messages: messages });
    } catch (error) {
        logger.error(`Błąd przy pobieraniu wiadomości : ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd serwera.' });
    } finally {
       if(connection) connection.release();
    }
});

router.put('/:msgId/read', async (req, res) => {
    
    const { msgId } = req.params;
    const connection = await pool.getConnection();

    try {
        await connection.query('UPDATE messages SET is_read = TRUE WHERE id =?', [msgId]);
        logger.info(`Wiadomość ${msgId} oznaczona jako przeczytana.`);
        return res.status(200).json({ status: 'error', message: 'Wiadomość oznaczona jako przeczytana.' });
    } catch (error) {
        logger.error(`Błąd przy oznaczaniu wiadomości ${msgId} jako przeczytanej: ${error}`);
        return res.status(500).json({ status: 'error', message: 'Błąd przy oznaczaniu wiadomości.' });
    } finally {
       if(connection) connection.release();
    }
})

module.exports = router;