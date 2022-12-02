import express from 'express';
import config from './config';
import socketService from './socketService';
import webhookModel from './models/webhooks';
import { logger } from './Logger';

const router = express.Router();

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
  let results = {};
  try {
    results = await webhookModel.findOne(qry);
  } catch (err) {
    return next(err);
  }
  return res.json(results);
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
  const webhookEvent = {
    bucket: req.params.bucket,
    method: req.method,
    headers: req.headers,
    body: req.body,
    ipAddress: req.ip,
  };
  if (req.params.bucket) {
    webhookEvent.bucket = req.params.bucket;
  }
  logger.info('received webhook', webhookEvent);
  try {
    const webhook = new webhookModel(webhookEvent);
    await webhook.save();
  } catch (err) {
    return next(err);
  }
  socketService.emit('webhook', webhookEvent);
  return res.send('Success');
});

router.use(function (err, _req, res, _next) {
  logger.error(err);
  return res.json({ message: err.message, stack: err.stack });
});

module.exports = router;
