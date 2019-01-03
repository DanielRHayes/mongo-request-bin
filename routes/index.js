'use strict';
const express = require('express');
const router = express.Router();

const webhookModel = require('../models/webhooks');

router.get('/', async function (req, res, next) {
    let results;
    try {
        results = await webhookModel.distinct('bucket');
    } catch (err) {
        return next(err);
    }
    return res.json(results);
});

router.get('/:bucket/:id', async function (req, res, next) {
    const qry = {
        _id: req.params.id,
        bucket: req.params.bucket
    };
    let results = {};
    try {
        results = await webhookModel.findOne(qry);
    } catch (err) {
        return next(err);
    }
    return res.json(results);
});

router.get('/:bucket', async function (req, res, next) {
    const qry = {
        bucket: req.params.bucket
    };
    let results = {};
    try {
        results = await webhookModel.find(qry).sort({ _id: -1 });
    } catch (err) {
        return next(err);
    }
    return res.json(results);
});

router.all('/:bucket', async function (req, res, next) {
    let obj = {
        bucket: req.params.bucket,
        method: req.method,
        headers: req.headers,
        body: req.body
    };
    if (req.params.bucket) {
        obj.bucket = req.params.bucket;
    }
    try {
        await webhookModel.create(obj);
    } catch (err) {
        return next(err);
    }
    return res.send('Success');
});


module.exports = router;