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
            agent: new ProxyAgent(`${this.proxyIPAddress}:80`, true),
        };
        if (webhook.headers && webhook.headers.authorization) {
            reqObj.headers = { authorization: webhook.headers.authorization };
        }
        try {
            await request(reqObj);
        } catch (err) {
            console.warn('error making forwarding request', err);
        }
    }
}

module.exports = Forwarder