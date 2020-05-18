/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

const app = require('./src/app.js');
var debug = require('debug')('huecommander:server');
var http = require('http');

var config = require('./config/config.js');

if (('undefined' == typeof(config.username)) || (config.username.length <= 0)) { 
    console.error('Unable to start and connect to HUE bridge when username is not defined');
    process.exit(1);
};


 
const port = (process.env.PORT || 3000);

app.set('port','port');

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


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

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}