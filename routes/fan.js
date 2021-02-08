/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

var express = require('express');
var router = express.Router();
// var authUtil = require('../src/authutils.js');
// var logHelper = require('../src/loghelper.js');
// var log = logHelper.createLogger();
// var request = require('then-request');

const bridgeUtils = require('../src/bridgeutils');

router.get('/on', function (req, res) {
    bridgeUtils.fanSetOn(true);
    res.render('index', {
        title: 'Hue Commander',
        user: req.user,
        lastCommand: 'Set Fan On',
    });
});

router.get('/off', function (req, res) {
    bridgeUtils.fanSetOn(false);
    res.render('index', {
        title: 'Hue Commander',
        user: req.user,
        lastCommand: 'Set Fan Off',
    });
});

module.exports = router;
