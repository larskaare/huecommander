/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

var logHelper = require('./loghelper.js');
const LightState = require('node-hue-api/lib/model/lightstate/LightState');
var log = logHelper.createLogger();

const v3 = require('node-hue-api').v3,
    hueApi = v3.api,
    lightState = v3.lightStates.LightState,
    discovery = v3.discovery;

const config = require('../config/config.js').hue;

//Const to keep color values for status api
const StatusColors = {
    'Away' : [0.1714,0.3545],
    'Occupied' :[0.6404,0.3337] ,
    'Available' : [0.378,0.5437]
};

//Async function to do bridge discovery
async function discoverBridge() {

    const discoveryResults = await discovery.nupnpSearch();
   
    if (discoveryResults.length === 0) {
        log.error('Failed to resolve any Hue Bridges');
        return null;
    } else {
        return discoveryResults[0].ipaddress;
    }
}

//Async function to switch status light on / off
async function StatusSwitch() {
    let authenticatedApi;

    try {
        authenticatedApi = await getAuthenticatedApi();
    } catch(err) {
        log.error('SetStatus was not able to get an authenticated HUE API');
    }

    const currentLightStatus = await authenticatedApi.lights.getLightAttributesAndState(config.light_id);
   
    if (currentLightStatus.state.on) {
        
        const newLightState = new lightState().off();
        const status = await authenticatedApi.lights.setLightState(config.light_id,newLightState);
        log.info('Hue Status light turned off is ' + status);
    } else {
          
        const newLightState = new lightState().on();
        const status = await authenticatedApi.lights.setLightState(config.light_id,newLightState);
        log.info('Hue Status light turned on is ' + status);
    }
   
}  

//Async function to set colors of statys light
async function SetStatus(status) {
    let authenticatedApi, colorCode;
    let turnFanOn = true;

    log.info('Preparing to set HUE status light to ' + status);

    try {
        authenticatedApi = await getAuthenticatedApi();
    } catch(err) {
        log.error('HUE SetStatus was not able to get an authenticated API');
    }

    switch (status) {
    case 'away':
        colorCode = StatusColors.Away;
        turnFanOn = false;
        break;
    case 'available':
        turnFanOn = true;
        colorCode = StatusColors.Available;
        break;
    case 'occupied' :
        turnFanOn = true;
        colorCode = StatusColors.Occupied;
        break;
    default:
        turnFanOn = true;
        colorCode = StatusColors.Available;
        break;
    }

    const newLightState = new lightState().on().ct(153).bri(198).hue(1416).sat(234).xy(colorCode);

    try {
        const setLight = await authenticatedApi.lights.setLightState(config.light_id,newLightState);
        fanSetOn(turnFanOn);
        log.info('HUE Status Light turned on, status ' + status + ' (' + setLight + ')');
    } catch (err) {
        log.error('Unable to set new HUE Status Light - current state ' + err);
    }
    
}


//Async function to get authenticated api (used in most other functions)
async function getAuthenticatedApi() {
    let ipAddress, authenticatedApi;

    try {
        ipAddress = await discoverBridge();
        log.debug('HUE - Discovered Bridge at ' + ipAddress);

    } catch (err) {
        log.error('Unable to discover any HUE bridges ' + err);
    }

    try {
        authenticatedApi = await hueApi.createLocal(ipAddress).connect(config.username);
        log.debug('HUE - Got authenticated API');
    } catch (err) {
        log.error('HUE - Unable to aquire a authenticated API ' + err);
    }

    return  authenticatedApi;

}

//Async function to set fan (on smartplug) to on/off
//Argument: true -> turn on, false -> turn off

async function fanSetOn(on) {
    let authenticatedApi;
    
    const fanState = new LightState();

    if (on) {
        fanState.on();
    } else {
        fanState.off();
    }

    log.info('fanSetOn: Preparing to set HUE fan/smartplug to on:' + on);

    try {
        authenticatedApi = await getAuthenticatedApi();
    } catch(err) {
        log.error('fanSetOn: HUE fanOn was not able to get an authenticated API');
    }

    try {
        const setFan = await authenticatedApi.lights.setLightState(config.fanId,fanState);
        log.info('fanSetOn: HUE Fan turned on:' + on);
        log.info(setFan);
    } catch (err) {
        log.error('fanSetOn: Unable to set new HUE Fan status: ' + err);
    }
    
}
    
module.exports = {discoverBridge, StatusSwitch, SetStatus, fanSetOn} ;