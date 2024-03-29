'use strict';

const express = require('express');
const router = express.Router();

const config = require('./config');
const socketService = require('./socketService');
const webhookModel = require('./models/webhooks');
const { logger } = require('./Logger');

/**
 * @api {get} / Get Buckets
 * @apiName Get Buckets
 * @apiGroup API
 * @apiDescription gets a list of all the buckets on the server
 */

router.get('/', async function (req, res, next) {
  let results;
  try {
    results = await webhookModel.distinct('bucket');
  } catch (err) {
    return next(err);
  }
  let obj = {
    buckets: results || [],
  };
  return res.json(obj);
});

router.get('/:bucket/most-recent', async function (req, res, next) {
  const { bucket } = req.params || {};

  let results = {};
  try {
    results = await webhookModel.find({ bucket }).sort({ _id: -1 }).limit(1);
  } catch (err) {
    return next(err);
  }

  // ability to show only the body of the request if you pass in "?only=body"
  if (req.query?.only === 'body') {
    return results[0]?.body;
  }

  return res.json(results[0]);
});

/**
 * @api {get} /:bucketName/:webhookId Get Webhook
 * @apiName Get Webhook
 * @apiGroup API
 * @apiDescription get a specific webhook from a bucket
 */
router.get('/:bucket/:id', async function (req, res, next) {
  const qry = {
    _id: req.params.id,
    bucket: req.params.bucket,
  };
  let result = {};
  try {
    result = await webhookModel.findOne(qry);
  } catch (err) {
    return next(err);
  }

  // ability to show only the body of the request if you pass in "?only=body"
  if (req.query && req.query.only === 'body') {
    return result.body;
  }

  return res.json(result);
});

/**
 * @api {get} /:bucketName Get Webhooks from Bucket
 * @apiName Get Webhooks from Bucket
 * @apiGroup API
 * @apiDescription gets the most recent webhooks from the bucket from newest to oldest
 */
router.get('/:bucket', async function (req, res, next) {
  const qry = {
    bucket: req.params.bucket,
  };
  let results = {};
  try {
    results = await webhookModel.find(qry).sort({ _id: -1 }).limit(50);
  } catch (err) {
    return next(err);
  }

  // ability to show only the body of the request if you pass in "?only=body"
  if (req.query && req.query.only === 'body') {
    return res.json(results.map((r) => r.body));
  }

  return res.json(results);
});

/**
 * @api {post} /reset Reset
 * @apiName Reset
 * @apiGroup API
 * @apiDescription deletes all the webhooks in the database
 *
 * @apiParam {String} password the password to reset the server from the environment variable `RESET_PASSWORD` the server
 */
router.post('/reset', async function (req, res, next) {
  const password = req.body && req.body.password;
  if (password !== config.password) {
    return res.json({ success: false, message: 'Invalid password' });
  }
  try {
    await webhookModel.remove({});
  } catch (err) {
    return next(err);
  }
  return res.json({ success: true, message: 'All webhooks were reset' });
});

router.all('/:bucket', async function (req, res, next) {
  const obj = {
    bucket: req.params.bucket,
    method: req.method,
    headers: req.headers,
    body: req.body,
    ipAddress: req.ip,
  };
  if (req.params.bucket) {
    obj.bucket = req.params.bucket;
  }
  logger.info('received webhook', obj);
  try {
    const webhook = new webhookModel(obj);
    await webhook.save();
  } catch (err) {
    return next(err);
  }
  socketService.emit('webhook', obj);
  return res.send('Success');
});

router.use(function (err, req, res, next) {
  logger.log('Received an error');
  logger.error(err);
  return res.json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
