'use strict';

class Logger {
  constructor(params = {}) {
    this.log = params.log;
    this.error = params.error;
  }

  info(message, data) {
    this.log(`INFO: ${message}`, data);
  }

  error(err) {
    this.error(err);
  }
}

module.exports = {
  logger: new Logger({
    log: console.log,
    error: console.error,
  }),
  Logger,
};
