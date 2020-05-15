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

    res.sendStatus(501);

});

router.get('/ledig', function(req, res) {

    res.sendStatus(501);

});

router.get('/borte', function(req, res) {

    res.sendStatus(501);

});


module.exports = router;