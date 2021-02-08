/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

var express = require('express');
var router = express.Router();
var authUtil = require('../src/authutils.js');
var logHelper = require('../src/loghelper.js');
var log = logHelper.createLogger();
var request = require('then-request');

const bridgeUtils = require('../src/bridgeutils');

router.get('/switch', function (req, res) {
    bridgeUtils.StatusSwitch();
    // res.sendStatus(200);
    res.render('index', {
        title: 'Hue Commander',
        user: req.user,
        lastCommand: 'Switch',
    });
});

router.get('/occupied', function (req, res) {
    bridgeUtils.SetStatus('occupied');
    // res.sendStatus(200);
    res.render('index', {
        title: 'Hue Commander',
        user: req.user,
        lastCommand: 'Occupied',
    });
});

router.get('/available', function (req, res) {
    bridgeUtils.SetStatus('available');
    // res.sendStatus(200);
    res.render('index', {
        title: 'Hue Commander',
        user: req.user,
        lastCommand: 'Available',
    });
});

router.get('/away', function (req, res) {
    bridgeUtils.SetStatus('away');
    // res.sendStatus(200);
    res.render('index', {
        title: 'Hue Commander',
        user: req.user,
        lastCommand: 'Away',
    });
});

router.get('/normal', function (req, res) {
    bridgeUtils.SetStatus('normal');
    // res.sendStatus(200);
    res.render('index', {
        title: 'Hue Commander',
        user: req.user,
        lastCommand: 'Normal',
    });
});

router.get('/presence', authUtil.ensureAuthenticated, function (req, res) {
    let presence;

    log.info('Preparing to get AD presence Status');

    // Prepare header with auth and bearer token
    var headers = {
        Authorization: 'Bearer ' + req.user.authInfo.access_token,
    };

    // Prepare and send request to graph api on messages in inBox
    request('GET', 'https://graph.microsoft.com/beta/me/presence', {
        body: '',
        headers: headers,
    }).done((response) => {
        if (response.statusCode == 200) {
            presence = JSON.parse(response.getBody());

            log.info('Got response ' + JSON.stringify(presence));

            //if (presence.activity === 'InACall' || presence.activity === 'InAConferenceCall' || presence.activity === 'InAMeeting' || presence.activity === 'Presenting' || presence.activity === 'InAMeeting') {
            if (
                presence.activity === 'InACall' ||
                presence.activity === 'InAConferenceCall' ||
                presence.activity === 'Presenting' ||
                presence.activity === 'InAMeeting'
            ) {
                const lastCommand =
                    'AD (Availability:' +
                    presence.availability +
                    ' - Activity:' +
                    presence.activity +
                    ') - Setting status occupied';

                bridgeUtils.SetStatus('occupied');
                res.render('presence', { lastCommand: lastCommand });
            } else {
                const lastCommand =
                    'AD (Availability:' +
                    presence.availability +
                    ' - Activity:' +
                    presence.activity +
                    ') - Setting status available';
                bridgeUtils.SetStatus('available');
                res.render('presence', { lastCommand: lastCommand });
            }
        } else {
            //Not 200
            log.warn('O365 - Unable to get presence ' + response.statusCode);
            res.render('index', {
                title: 'Hue Commander',
                user: req.user,
                lastCommand: presence,
            });
        }
    });
});

module.exports = router;
