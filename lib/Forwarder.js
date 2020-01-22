'use strict';
const util = require('util');
const request = require('request');

const {logger} = require('./Logger');
const config = require('./config');

const post = util.promisify(request.post);

class Forwarder {
    constructor(params = {}){
        this.forwardProxyUrl = params.forwardToUrl || config.forwardProxyUrl;
        this.forwardFromBucket = params.forwardFromBucket || config.forwardFromBucket;     
        this.forwardToUrl = params.forwardToUrl || config.forwardToUrl;   
    }

    isForwarderConfigured(){
        if(this.forwardProxyUrl && this.forwardFromBucket && this.forwardToUrl){
            return true;
        }
        return false;
    }

    async forward(webhookDoc) {
        const postOptions = {
            method: 'POST',
            uri: this.forwardToUrl,
            proxy: this.forwardProxyUrl,
            body: webhookDoc,
            json: true
        };
        logger.info('post options', postOptions);
        logger.log('trying to post');
        await post(postOptions);
        logger.log('posting');
    }
}

module.exports = Forwarder;