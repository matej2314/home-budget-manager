const cors = require('cors');

const corsConfig = (app) => {
    const allowedOrigins = ['https://budgetapp.msliwowski.net', 'http://localhost:5173', 'http://185.170.196.107:5052'];

    app.use(
        cors({
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true,
        })
    );

    app.options('*', (req, res) => {
        res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.status(200).end();
    });
};

module.exports = corsConfig;