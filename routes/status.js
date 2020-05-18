/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

var express = require('express');
var router = express.Router();


const bridgeUtils = require('../src/bridgeutils');

router.get('/switch', function(req, res) {

    bridgeUtils.StatusSwitch();
    res.sendStatus(200);

});


router.get('/opptatt', function(req, res) {
       
    bridgeUtils.SetStatus('occupied');
    res.sendStatus(200);

});

router.get('/ledig', function(req, res) {

    bridgeUtils.SetStatus('available');
    res.sendStatus(200);

});

router.get('/borte', function(req, res) {

    bridgeUtils.SetStatus('away');
    res.sendStatus(200);

});


module.exports = router;