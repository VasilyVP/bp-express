const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
//const cors = require('cors');

//const authentication = require('./middleware/authentication').authentication;
const cfg = require('./app-config.json');
const routes = require('./routes/index');

const app = express();

/** NGINX proxy required */
//app.enable('trust proxy');

/** CORS enable */
//app.use(cors())

app.use(express.json());
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(authentication);

/**
 * Logging
*/
// development
if (process.env.NODE_ENV !== 'production') {
    app.use(logger('dev'));
}
// access log
if (process.env.ACCESS_LOG_FROM) {
    const morganLogWriteStream = fs.createWriteStream(path.join(__dirname, cfg.accessLog), { flags: 'a' });
    app.use(logger('combined', {
        skip: (req, res) => res.statusCode < process.env.ACCESS_LOG_FROM,
        stream: morganLogWriteStream
    }));
}

/** Handling all routes */
app.use('/', routes);

/** Not Found handling */
app.all('*', (req, res, next) => {
    res.status(404).json({
        code: 404,
        message: 'Not Found',
    });
});

/**
 * Errors handling
 */
const errorsStream = fs.createWriteStream(path.join(__dirname, cfg.errorLog), { flags: 'a' });
app.use((err, req, res, next) => {
    if (createError.isHttpError(err)) {
        if (errorsStream) errorsStream.write(new Date().toUTCString() + ` ${err.message}\n Error stack:\n ${err.stack}\n`);

        res.status(err.status).json({
            code: err.status,
            message: err.status < 500 ? err.message : 'Server Error',
        });
    } else {
        if (errorsStream) errorsStream.write(new Date().toUTCString() + ` ${err}\n`);

        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
        });
    }
});

module.exports = app;