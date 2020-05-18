/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

var logger = require('./loghelper.js').logger;

const v3 = require('node-hue-api').v3,
    hueApi = v3.api,
    lightState = v3.lightStates.LightState,
    discovery = v3.discovery;

const config = require('../config/config.js');

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
        logger.error('Failed to resolve any Hue Bridges');
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
        logger.error('SetStatus was not able to get an authenticated API');
    }

    const currentLightStatus = await authenticatedApi.lights.getLightAttributesAndState(config.light_id);
   
    if (currentLightStatus.state.on) {
        
        const newLightState = new lightState().off();
        const status = await authenticatedApi.lights.setLightState(config.light_id,newLightState);
        logger.info('Light turned off is ' + status);
    } else {
          
        const newLightState = new lightState().on();
        const status = await authenticatedApi.lights.setLightState(config.light_id,newLightState);
        logger.info('Light turned on is ' + status);
    }
   
}  

//Async function to set colors of statys light
async function SetStatus(status) {
    let authenticatedApi, colorCode;

    try {
        authenticatedApi = await getAuthenticatedApi();
    } catch(err) {
        logger.error('SetStatus was not able to get an authenticated API');
    }

    switch (status) {
    case 'away':
        colorCode = StatusColors.Away;
        break;
    case 'available':
        colorCode = StatusColors.Available;
        break;
    case 'occupied' :
        colorCode = StatusColors.Occupied;
        break;
    default:
        colorCode = StatusColors.Available;
        break;
    }

    const newLightState = new lightState().on().ct(153).bri(198).hue(1416).sat(234).xy(colorCode);
    
    try {
        const setLight = await authenticatedApi.lights.setLightState(config.light_id,newLightState);
        logger.info('Light turned on, status ' + status + ' (' + setLight + ')');
    } catch (err) {
        logger.error('Unable to set new light state - current state ' + err);
    }
    
}


//Async function to get authenticated api (used in most other functions)
async function getAuthenticatedApi() {
    let ipAddress, authenticatedApi;

    try {
        ipAddress = await discoverBridge();
        logger.debug('Discovered Bridge at ' + ipAddress);

    } catch (err) {
        logger.error('Unable to discover any HUE bridges ' + err);
    }

    try {
        authenticatedApi = await hueApi.createLocal(ipAddress).connect(config.username);
        logger.debug('Got authenticated API');
    } catch (err) {
        logger.error('Unable to aquire a authenticated API ' + err);
    }

    return  authenticatedApi;

}

    
module.exports = {discoverBridge, StatusSwitch, SetStatus} ;