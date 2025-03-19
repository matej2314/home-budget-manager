const helmet = require('helmet');

const helmetConfig = (app) => {
    app.use(helmet());
    app.use(helmet.frameguard({ action: 'deny' }));
    app.use(helmet.noSniff());
    app.use(helmet.contentSecurityPolicy({
        directives: {
            scriptSrc: [
                ["https://budgetapp.msliwowski.net"],
            ],
            styleSrc: [
                "'self'",
            ],
            imgSrc: [
                ["https://budgetapp.msliwowski.net"],
                "data:"
            ],
            connectSrc: [
                "https://budgetapi.msliwowski.net",
                "https://budgetapp.msliwowski.net",
                "wss://budgetapi.msliwowski.net",
            ],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
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