/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express();

var api_status_router = require('../routes/status.js');

//
// Middleware to come
//



app.use(bodyParser.json());
app.use(methodOverride());

app.use('/api/status', api_status_router);

app.use(function (err, req, res, next) {
    console.log('Catching errors');
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).send('Oops');
    //   res.render('error', { error: err })
});


module.exports = app;