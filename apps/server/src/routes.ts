import express from 'express';
import { socketService } from './services/SocketService';
import { WebhookModel } from './models/Webhook';
import { logger } from './logger';
import { requirePassword } from './middleware';

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
    results = await WebhookModel.distinct('bucket');
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
    results = await WebhookModel.find({ bucket }).sort({ _id: -1 }).limit(1);
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
  const onlyBody = req.query && req.query.only === 'body';
  try {
    const result = await WebhookModel.findOne({ _id: req.params.id, bucket: req.params.bucket });
    return res.json(onlyBody ? result.body : result);
  } catch (err) {
    return next(err);
  }
});

/**
 * @api {get} /:bucketName Get Webhooks from Bucket
 * @apiName Get Webhooks from Bucket
 * @apiGroup API
 * @apiDescription gets the most recent webhooks from the bucket from newest to oldest
 */
router.get('/:bucket', async function (req, res, next) {
  const onlyBody = req.query && req.query.only === 'body';
  try {
    const results = await WebhookModel.find({ bucket: req.params.bucket }).sort({ _id: -1 }).limit(50);
    return res.json(onlyBody ? results.map((r) => r.body) : results);
  } catch (err) {
    return next(err);
  }
});

/**
 * @api {post} /reset Reset
 * @apiName Reset
 * @apiGroup API
 * @apiDescription deletes all the webhooks in the database
 *
 * @apiParam {String} password the password to reset the server from the environment variable `RESET_PASSWORD` the server
 */
router.post('/reset', requirePassword, async function (_req, res, next) {
  try {
    await WebhookModel.remove({});
    return res.json({ success: true, message: 'All webhooks were reset' });
  } catch (err) {
    return next(err);
  }
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
    const webhook = new WebhookModel(obj);
    await webhook.save();
  } catch (err) {
    return next(err);
  }
  socketService.emitSocketMessage('webhook', obj);
  return res.send('Success');
});

router.use(function (err, _req, res, _next) {
  logger.error('Received an error', err);
  return res.json({ message: err.message, stack: err.stack });
});

export default router;
