const dotenv = require('dotenv').config({ path: './.env' });
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('./configs/logger.js');
const express = require('express');
const app = express();

const port = process.env.SERV_PORT || 5053;

app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(cors());

// app.options('*', (req, res) => {
//     res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type',);
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.status(200).end();
// });

try {
    app.listen(port, () => {
        logger.info(`BACKEND SERVER RUNNING. PORT ${port}`);
        console.log(`SERVER RUNNING ON PORT ${port}`);
    });
} catch (error) {
    logger.error(`Nie udało się uruchomić serwera : ${error} `);
    console.log('Nie udało się uruchomić serwera.');
}