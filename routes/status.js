/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

var express = require('express');
var router = express.Router();


const bridgeUtils = require('../src/bridgeutils');

router.get('/switch', function(req, res) {

    bridgeUtils.hueSwitch();
    res.sendStatus(200);

});


router.get('/opptatt', function(req, res) {

    bridgeUtils.setOccupied();    
    res.sendStatus(200);

});

router.get('/ledig', function(req, res) {

    bridgeUtils.SetAvailable();
    res.sendStatus(200);

});

router.get('/borte', function(req, res) {

    bridgeUtils.SetAway;
    res.sendStatus(200);

});


module.exports = router;