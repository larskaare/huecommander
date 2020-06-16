# HueCommander

A PlayGround project to mess around with Philips Hue lights

The project cosist of a small front-end and a bit bigger back-end.The front  list the various api calls supported by the back end as well as enabling the user to sign in to Azure AD to get access tokens for reading the O365 presence state. The back-end takes the api call and uses those command the HUE lights. One specific light is set to the designates status light - in my case a led strip.

**My usage:** I run the Hue commander on localhost, login and acticate the presence part of the api. This monitors my presence in Office365 and whenever I go into a Microsoft Teams call or are presenting, the status light switches to red and my fan is turned off (due to noise). The status goes back to green when I'm done and the fan is turned on again. It's a nice way to communicate my status to my surroundings and to get proper ventilation.

## Pysical components

* [Philips Hue Bridge](https://www2.meethue.com/en-us/p/hue-bridge/046677458478)
* [Philips Hue Light Strip](https://www2.meethue.com/en-us/p/hue-white-and-color-ambiance-lightstrip-outdoor-197-inch/046677530938)
* [Philips Hue Smart Plug](https://www2.meethue.com/en-us/p/hue-smart-plug/046677552343)

## Installing the project

Assuming you have a working NodeJS environment. I've done my testing on v12.16.3

```(bash)
$> git clone git@github.com:larskaare/huecommander.git

$> npm install
```

## Configuration & Environment variables

The Hue Commander is driven by configuration from two places.

### ./config/config.js

The most important config here is the **hue.light_id**. Set it to the id of your light equipment. If you only have one accessory connected to the bridge - it's most likely **1**. The **hue.fanId** referes to a smartPlug holding a fan (or other equipment).

### Environment variables

```(bash)
export NODE_ENV=development
export CLIENT_ID="<app id in Azure AD>"
export TENANT_ID="<tenant id in Azure AD>"
export CLIENT_SECRET="<the Azure AD app object client secret>"
export REDIRECT_URL="http://localhost:3000/auth/openid/return"
export PORT=3000
export HUE_USERNAME="<The Hue Bridge credentials>"
```

Create the Hue Bridge credentials using the [Hue Api](https://developers.meethue.com/develop/hue-api/)

### Azure AD

To be able to read you presence status from Office 365 you need an application object in a relevant Azure AD. The object is used to log in (single sign on) and aquire access tokens used to read the status from the Office 365 graph. More information on this on [Microsoft Docs](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

## Run

It's easy enough (it works on my machine)

```(bash)
$> npm start
```

## Hue Resources

* [The Hue Api](https://developers.meethue.com/develop/hue-api/)
* [The Hue Developer Portal](https://developers.meethue.com/)
* [The NodeJS Module for Hue by Peter Murray](https://github.com/peter-murray/node-hue-api)

## Deployment models

### In-house

I am runnig my set-up on localhost. It's simple and it works. The primary reason is the autenthication and authorization with Azure AD which only allows http connections to localhost for the redirects (Which is a good thing). It could easily be installed on another device, like a Raspberry PI. This would require a bit more pluming like enabling https and providing an external callback utl for the authentication procedure.

### In the cloud

The solution could quoite easily be hosted on external platforms like [Radix](https://www.radix.equinor.com/). This raises one challenge - how to reach the Hue lights? Two patterns comes to mind. One, you could set-up your Hue bridge to utilize the native [Remote API](https://developers.meethue.com/develop/hue-api/remote-api-quick-start-guide/). Two; you could split the application - let the front-end with authentication run in the cloud while moving the api parts that talk to the Hue Bridge in-house. This would require exposing and secure the api to the cloud - but could be a fun exercise for learning purposes.

