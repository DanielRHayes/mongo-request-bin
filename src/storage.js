'use strict';
const mongoose = require('mongoose');
const config = require('./config');

async function start() {
  await mongoose.connect(config.mongoUri);
  console.log('connected to mongo');
}

module.exports = { start };
