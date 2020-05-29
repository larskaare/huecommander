/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

const express = require('express');
const app = express();
var logger = require('./loghelper.js').logger;
var winston = require('winston');
var expressWinston = require('express-winston');

var api_status_router = require('../routes/status.js');

//
// Middleware to come
//

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    meta: false, 
    msg: 'HTTP {{req.method}} {{req.url}}', 
    expressFormat: true, 
    colorize: true,
    ignoreRoute: function (req, res) { return false; } 
}));

  
// Routes
app.use('/api/status', api_status_router);



//Catching bad url's and errors
app.get('*', function(req, res, next) {  
    logger.info('Unknown path ' + req.path + ' was requested, issuing a HTTP 404');
    res.status(404).send();
});


app.use(function (error, req, res, next) {

    logger.info('Catching errors at end of middleware');
    
    if (res.headersSent) {
        return next(error);
    }

    res.status(500).send();
    //    res.render('error', { error: err })
});


module.exports = app;