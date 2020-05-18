/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

var logger = require('./loghelper.js').logger;

const v3 = require('node-hue-api').v3,
    hueApi = v3.api,
    lightState = v3.lightStates.LightState,
    discovery = v3.discovery;

const config = require('../config/config.js');


async function discoverBridge() {

    const discoveryResults = await discovery.nupnpSearch();
   
    if (discoveryResults.length === 0) {
        logger.error('Failed to resolve any Hue Bridges');
        return null;
    } else {
        return discoveryResults[0].ipaddress;
    }
}


async function hueSwitch() {

    const ipAddress = await discoverBridge();
    const authenticatedApi = await hueApi.createLocal(ipAddress).connect(config.username);
    const currentLightStatus = await authenticatedApi.lights.getLightAttributesAndState(config.light_id);
   
    if (currentLightStatus.state.on) {
        
        const newLightState = new lightState().off();
        const status = await authenticatedApi.lights.setLightState(config.light_id,newLightState);
        logger.info('Light turned off is ' + status);
    } else {
          
        const newLightState = new lightState().on().ct(200).bri(100);
        const status = await authenticatedApi.lights.setLightState(config.light_id,newLightState);
        logger.info('Light turned on is ' + status);
    }
   
}

async function setOccupied() {

    const ipAddress = await discoverBridge();
    const authenticatedApi = await hueApi.createLocal(ipAddress).connect(config.username);
    const currentLightStatus = await authenticatedApi.lights.getLightAttributesAndState(config.light_id);
   
    const newLightState = new lightState().on().ct(153).bri(198).hue(1416).sat(234).xy([0.6404,0.3337]);
    const status = await authenticatedApi.lights.setLightState(config.light_id,newLightState);

    if (status) {
        logger.info('Light turned on, status OCCUPIED');
    } else {
        logger.error('Unable to set new light state - current state ' + JSON.stringify(currentLightStatus));
    }
    
}

async function SetAvailable() {

    const ipAddress = await discoverBridge();
    const authenticatedApi = await hueApi.createLocal(ipAddress).connect(config.username);
    const currentLightStatus = await authenticatedApi.lights.getLightAttributesAndState(config.light_id);
   
    logger.info(JSON.stringify(currentLightStatus));
    
    const newLightState = new lightState().on().ct(153).bri(198).hue(1416).sat(234).xy([0.378,0.5437]);
    const status = await authenticatedApi.lights.setLightState(config.light_id,newLightState);

    if (status) {
        logger.info('Light turned on, status OCCUPIED');
    } else {
        logger.error('Unable to set new light state - current state ' + JSON.stringify(currentLightStatus));
    }
    

}
    

async function SetAway() {

    const ipAddress = await discoverBridge();
    const authenticatedApi = await hueApi.createLocal(ipAddress).connect(config.username);
    const currentLightStatus = await authenticatedApi.lights.getLightAttributesAndState(config.light_id);
   
    logger.info(JSON.stringify(currentLightStatus));
    
    const newLightState = new lightState().on().ct(153).bri(198).hue(1416).sat(234).xy([0.1714,0.3545]);
    const status = await authenticatedApi.lights.setLightState(config.light_id,newLightState);

    if (status) {
        logger.info('Light turned on, status OCCUPIED');
    } else {
        logger.error('Unable to set new light state - current state ' + JSON.stringify(currentLightStatus));
    }
    

}
    
module.exports = {discoverBridge, hueSwitch, setOccupied, SetAvailable, SetAway} ;