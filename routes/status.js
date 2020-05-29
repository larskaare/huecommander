/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

var express = require('express');
var router = express.Router();
var authUtil = require('../src/authutils');
var logHelper = require('../src/logHelper');
var log = logHelper.createLogger();
var request = require('then-request');


const bridgeUtils = require('../src/bridgeutils');

router.get('/switch', authUtil.ensureAuthenticated,function(req, res) {

    bridgeUtils.StatusSwitch();
    // res.sendStatus(200);
    res.render('index', { title: 'Hue Commander', user: req.user, lastCommand: 'Switch' });

});


router.get('/opptatt', authUtil.ensureAuthenticated,function(req, res) {
       
    bridgeUtils.SetStatus('occupied');
    // res.sendStatus(200);
    res.render('index', { title: 'Hue Commander', user: req.user, lastCommand: 'Opptatt' });

});

router.get('/ledig', authUtil.ensureAuthenticated,function(req, res) {

    bridgeUtils.SetStatus('available');
    // res.sendStatus(200);
    res.render('index', { title: 'Hue Commander', user: req.user, lastCommand: 'Ledig' });

});

router.get('/borte', authUtil.ensureAuthenticated,function(req, res) {

    bridgeUtils.SetStatus('away');
    // res.sendStatus(200);
    res.render('index', { title: 'Hue Commander', user: req.user, lastCommand: 'Borte' });

});


router.get('/ad', authUtil.ensureAuthenticated, function(req, res) {

    let presence;

    log.info('Preparing to get AD presence Status');

    // Prepare header with auth and bearer token
    var headers = {
        'Authorization': 'Bearer ' + req.user.authInfo.access_token 
    };

    // Prepare and send request to graph api on messages in inBox
    request('GET', 'https://graph.microsoft.com/beta/me/presence', {
        body: '',
        headers: headers
    }).done((response => {

        if (response.statusCode == 200){
        
            presence = JSON.parse(response.getBody());
            
            log.info('Got response ' + JSON.stringify(presence));

            const lastCommand = 'AD (' + presence.availability + ' - ' + presence.activity + ')';

            //API ref  https://docs.microsoft.com/en-us/graph/api/resources/presence?view=graph-rest-beta


            //if (presence.activity === 'InACall' || presence.activity === 'InAConferenceCall' || presence.activity === 'InAMeeting' || presence.activity === 'Presenting') {
            if (presence.activity === 'InACall' || presence.activity === 'InAConferenceCall' || presence.activity === 'Presenting') {
            
                const lastCommand = 'AD (' + presence.availability + ' - ' + presence.activity + ') - Setting status occupied';
                
                bridgeUtils.SetStatus('occupied');
                res.render('presence', { lastCommand: lastCommand });

            } else {

                const lastCommand = 'AD (' + presence.availability + ' - ' + presence.activity + ') - Setting status available';
                bridgeUtils.SetStatus('available');
                res.render('presence', { lastCommand: lastCommand });
            }

        } else {

            //Not 200
            log.warn('Unable to get presence ' + response.statusCode);
            res.render('index', { title: 'Hue Commander', user: req.user, lastCommand: presence });
        }

    }));

});

module.exports = router;