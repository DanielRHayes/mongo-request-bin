'use strict';
const util = require('util');
const request = require('request');
const ProxyAgent = require('proxy-agent');

const { logger } = require('./Logger');
const config = require('./config');

const post = util.promisify(request.post);

class Forwarder {
  constructor(params = {}) {
    this.forwardProxyUrl = params.forwardToUrl || config.forwardProxyUrl;
    this.forwardFromBucket = params.forwardFromBucket || config.forwardFromBucket;
    this.forwardToUrl = params.forwardToUrl || config.forwardToUrl;
  }

  isForwarderConfigured() {
    if (this.forwardProxyUrl && this.forwardFromBucket && this.forwardToUrl) {
      return true;
    }
    return false;
  }

  async forward(webhookDoc) {
    logger.info('forwarding webhook', webhookDoc);
    const postOptions = {
      method: webhookDoc.method,
      uri: this.forwardToUrl,
      agent: new ProxyAgent(this.forwardProxyUrl, true),
      body: webhookDoc.body,
      json: true,
    };
    await post(postOptions);
    logger.info('completed forwarding webhook', webhookDoc);
  }
}

module.exports = Forwarder;
