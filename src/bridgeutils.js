/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

const v3 = require('node-hue-api').v3,
    hueApi = v3.api,
    lightState = v3.lightStates.LightState,
    discovery = v3.discovery;

const config = require('../config/config.js');


async function discoverBridge() {

    const discoveryResults = await discovery.nupnpSearch();
   
    if (discoveryResults.length === 0) {
        console.error('Failed to resolve any Hue Bridges');
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
        console.log('Light turned off');
    } else {
          
        const newLightState = new lightState().on().ct(200).bri(100);
        const status = await authenticatedApi.lights.setLightState(config.light_id,newLightState);
        console.log('Light turned on');
    }
   
}

    
module.exports = {discoverBridge, hueSwitch};