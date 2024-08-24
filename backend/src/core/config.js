const config = {
    // -- see express-session for more options
    session: {
        enabled: false,
        settings: {
            secret: 'replace this for a more secure secret',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true }
        }
    },
    // -- see npm body-parser for more settings
    bodyParser: {
        enabled: true,
        settings: {
            json: { enabled: true, settings: { limit: '2mb' } },
            urlencoded: { enabled: true, settings: { extended: false, limit: '2mb' } }
        }
    },

    CORS: {
        enabled: true,
        settings: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            'Access-Control-Expose-Headers': 'Content-Disposition',
            'Access-Control-Allow-Methods': '*'
        }
    }
};

export { config };
