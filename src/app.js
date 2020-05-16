/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

const express = require('express');
const app = express();

var api_status_router = require('../routes/status.js');

//
// Middleware to come
//

// Routes
app.use('/api/status', api_status_router);



//Catching bad url's and errors
app.get('*', function(req, res, next) {  
    console.log('Unknown path %s was requested, issuing a HTTP %s',req.path,404);
    res.status(404).send();
});


app.use(function (error, req, res, next) {

    console.log('Catching errors at end of middleware');
    
    if (res.headersSent) {
        return next(err);
    }

    res.status(500).send();
    //    res.render('error', { error: err })
});


module.exports = app;