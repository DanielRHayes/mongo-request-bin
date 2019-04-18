'use strict';

const request = require('request-promise-native');
const ProxyAgent = require('proxy-agent');

const config = require('./config');

class Forwarder {
    constructor(params = {}) {
        this.proxyIPAddress = params.proxyIPAddress || config.proxyIPAddress;
    }

    async forward(webhook, forwardingUrl) {
        console.log(`--- Forwarding to ${forwardingUrl} ---`);
        const reqObj = {
            url: forwardingUrl,
            method: webhook.method,
            body: webhook.body,
            json: true,
            agent: new ProxyAgent(`${this.proxyIPAddress}:80`, true)
        };
        try {
            await request(reqObj);
        } catch (err) {
            log.warn('error making forwarding request', err);
        }
    }
}

module.exports = Forwarder