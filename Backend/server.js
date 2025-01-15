const dotenv = require('dotenv').config({ path: './.env' });
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('./configs/logger.js');
const express = require('express');
const swaggerDocs = require('./configs/swaggerConfig.js');
const balanceHouseActions = require('./tasks/balanceHouseTransactions.js');
const app = express();

const port = process.env.SERV_PORT || 5053;

const allowedOrigins = ['http://localhost'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// app.options('*', (req, res) => {
//     res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type',);
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.status(200).end();
// });

swaggerDocs(app);

const authRouter = require('./routes/authRoutes.js');
const usersRouter = require('./routes/usersRoutes.js');
const householdRouter = require('./routes/householdRoutes.js');
const transactionRouter = require('./routes/transactionsRoutes.js');
const dashboardRouter = require('./routes/dashboardRoutes.js');
const actionCatRouter = require('./routes/actionCatRoutes.js');


app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/house', householdRouter);
app.use('/action', transactionRouter);
app.use('/board', dashboardRouter);
app.use('/actioncat', actionCatRouter);

try {
    app.listen(port, () => {
        logger.info(`BACKEND SERVER RUNNING. PORT ${port}`);
        console.log(`SERVER RUNNING ON PORT ${port}`);

        balanceHouseActions();
    });
} catch (error) {
    logger.error(`Nie udało się uruchomić serwera : ${error} `);
    console.log('Nie udało się uruchomić serwera.');
}