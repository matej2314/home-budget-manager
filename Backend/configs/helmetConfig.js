const helmet = require('helmet');

const helmetConfig = (app) => {
    app.use(helmet());
    app.use(helmet.frameguard({ action: 'deny' }));
    app.use(helmet.noSniff());
    app.use(helmet.contentSecurityPolicy({
        directives: {
            scriptSrc: [
                ["'self'", "https://budgetapp.msliwowski.net", "https://budgetapi.msliwowski.net", "wss://budgetapi.msliwowski.net", "http://185.170.196.107:5052"],
            ],
            styleSrc: [
                "'self'",
            ],
            imgSrc: [
                ["'self'", "https://budgetapp.msliwowski.net", "https://budgetapi.msliwowski.net", "http://185.170.196.107:5052"],
                "data:"
            ],
            connectSrc: [
                "'self'",
                "https://budgetapi.msliwowski.net",
                "https://budgetapp.msliwowski.net",
                "http://185.170.196.107:5052",
                "wss://budgetapi.msliwowski.net",
            ],
            frameSrc: ["'none'"],
            objectSrc: ["'self'"],
            upgradeInsecureRequests: [],
        }
    }));
    app.use(helmet.permissionPolicy({
        features: {
            fullscreen: ['*'],
            geolocation: ['self'],
            microphone: ['none'],
            camera: ['none']

        }
    }))
};

module.exports = helmetConfig;