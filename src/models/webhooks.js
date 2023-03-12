'use strict';
const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Mixed } = Schema.Types;

const schema = new Schema({
  bucket: String,
  method: String,
  receivedDateTime: { type: Date, default: Date.now },
  body: Mixed,
  headers: Mixed,
  ipAddress: String,
});

schema.index({ bucket: 1, receivedDateTime: -1 });

module.exports = mongoose.model('Webhook', schema);
