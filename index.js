/* eslint-disable indent */
const express = require('express');
const app = express();
const v3 = require('node-hue-api').v3,
    hueApi = v3.api,
    lightState = v3.lightStates.LightState;

const config = require('./config/config.js');

const bridgeUtils = require('./src/bridgeutils');

 
app.get('/api/switch', function (req, res) {

    hueSwitch();
    res.status(200).send('Ok');
}); 

app.listen(process.env.PORT || 3000);

async function hueSwitch() {

    const ipAddress = await bridgeUtils.discoverBridge();
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

