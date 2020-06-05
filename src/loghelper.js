//
// Gathering log definers in a helper library
// Create logger is for logging outside the express middleware
// Express logger config defines express middleware logging levels 
//

var bunyan = require('bunyan');
var config = require('../config/config.js');


//Logger for non middleware
exports.createLogger = function(){

    switch (process.env.NODE_ENV) {

    case 'development':
        return bunyan.createLogger({
            name: 'HueC-Dev',
            stream: process.stdout,
            level: config.appConfig.logLevel.development       
        });

    case 'debug':
        return bunyan.createLogger({
            name: 'HueC-Deb',
            stream: process.stdout,
            level: config.appConfig.logLevel.debug       
        });

    case 'production':
        return bunyan.createLogger({
            name: 'HueC-Prod',
            stream: process.stdout,
            level: config.appConfig.logLevel.production       
        });

    default:
        return bunyan.createLogger({
            name: 'HueC-Def',
            stream: process.stdout,
            level: config.appConfig.logLevel.development       
        });
    }

};

//Environmental aware config for the middleware
exports.expressLoggerConfig = function() {
    
    switch (process.env.NODE_ENV) {

    case 'development':
        return {name: 'Express-Dev',
            streams: [{
                level: config.appConfig.logLevel.development,
                stream: process.stdout
            }],
            excludes: ['req-headers', 'user-agent','res-headers','response-hrtime','req','res','body']
        };

    case 'production':
        return {name: 'Express-Prod',
            streams: [{
                level: config.appConfig.logLevel.production,
                stream: process.stdout
            }],
            excludes: ['req-headers', 'user-agent','res-headers','response-hrtime','req','res']
        };

    case 'debug':
        return {name: 'Express-Deb',
            streams: [{
                level: config.appConfig.logLevel.debug,
                stream: process.stdout
            }],
            // excludes: ['req-headers', 'user-agent','res-headers','response-hrtime','req','res']
        };

    default :
        return {name: process.env.NODE_ENV,
            streams: [{
                level: 'Express-Def',
                stream: process.stdout
            }],
            excludes: ['req-headers', 'user-agent','res-headers','response-hrtime','req','res']
        };
                                                    
    }

    
};

