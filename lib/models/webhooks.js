const mongoose = require('mongoose');

const config = require('../config');
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
    console.log('post save hook');
    if (!config.forwardUrl && !config.forwardBucket) {
        console.log(config);
        return next();
    }
    try {
        await forwarder.forward(doc, config.forwardUrl);
    } catch (err) {
        console.error(err);
        return next();
    }
    return next();
});


module.exports = mongoose.model('Webhook', schema);
