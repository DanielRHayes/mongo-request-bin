import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import logger from 'morgan';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(require('./routes'));

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  let err = new Error('not found');
  // @ts-ignore
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, _next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.json({ error: true });
});

export default app;
