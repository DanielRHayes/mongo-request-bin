'use strict';
const util = require('util');
const mongoose = require('mongoose');

const { logger } = require('../Logger');
const Forwarder = require('../Forwarder');
const forwarder = new Forwarder();


const { Schema } = mongoose;
const { Mixed } = Schema.Types;

const schema = new Schema({
    bucket: String,
    method: String,
    receivedDateTime: {
        type: Date,
        default: Date.now
    },
    body: Mixed,
    headers: Mixed,
    ipAddress: String
});

schema.post('save', async function (doc, next) {
    logger.log('post save webhook');
    const isForwarderConfigured = forwarder.isForwarderConfigured();
    if(isForwarderConfigured === false){
      return;
    }

    try {
        logger.log('trying to forward');
        await forwarder.forward(doc);
        logger.log('forward success');
    } catch (err) {
        logger.log('post save webhook');logger.log('post save webhook');
        logger.error(err);
    }

    return next();
});


module.exports = mongoose.model('Webhook', schema);
