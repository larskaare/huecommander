/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

const discovery = require('node-hue-api').v3.discovery;

var discoverBridge = require('../src/bridgeutils.js').discoverBridge;


describe('Bridge utils - discoverBridge()', function () {

    let sandbox = null;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });


    it('should return ip when discovered', async function () {

        var discoveryObject = [{
            'name': 'Philips hue',
            'ipaddress': '192.168.0.255',
            'modelid': 'BSB002',
            'swversion': '1938112040'
        }];

        sandbox.stub(discovery, 'nupnpSearch').resolves(discoveryObject);

        var ipAddress = await discoverBridge();

        expect(ipAddress).to.be.equals('192.168.0.255');

    });


    it('should return null when not discovered', async function () {

        var discoveryObject = '';

        sandbox.stub(discovery, 'nupnpSearch').resolves(discoveryObject);

        var ipAddress = await discoverBridge();

        expect(ipAddress).to.be.null;
    });






});
