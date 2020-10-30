#!/usr/bin/env node

/**
 * Application initializing
 */
const app = require('./app');
var debug = require('debug')('server:server');
const http = require('http');
//const https = require('https');

/** Getting port */
const port = process.env.PORT || 3000;
app.set('port', port);

/** Get key and certificate for https */
//const key = fs.readFileSync('./data/private/server.key');
//const cert = fs.readFileSync('./data/private/server.cert');

/** Create HTTP server */
var server = http.createServer(app);
//const server = https.createServer({ key, cert }, app);

/** Listen on provided port, on all network interfaces */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/** Event listener for HTTP server "error" event */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/** Event listener for HTTP server "listening" event */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
