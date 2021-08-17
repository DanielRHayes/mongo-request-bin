'use strict';
const express = require('express');
const app = express();
const logger = require('morgan');
const mongoose = require('mongoose');

const config = require('./config');

// connect to mongodb
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
  if (err) {
    console.error(err);
  }
  console.log('connect to mongodb');
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(require('./routes'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.json({ error: true });
});

module.exports = app;
