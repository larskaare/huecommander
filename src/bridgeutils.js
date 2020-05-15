
const discovery = require('node-hue-api').v3.discovery;

async function discoverBridge() {

    const discoveryResults = await discovery.nupnpSearch();
   
    if (discoveryResults.length === 0) {
        console.error('Failed to resolve any Hue Bridges');
        return null;
    } else {
        return discoveryResults[0].ipaddress;
    }
}

    
module.exports = {discoverBridge};