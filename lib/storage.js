'use strict';
const mongoose = require('mongoose');
const config = require('./config');

async function start() {
  await mongoose.connect(config.mongoUri, { useNewUrlParser: true });
}

module.exports = { start };
