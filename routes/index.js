'use strict';
const express = require('express');
const router = express.Router();

const webhookModel = require('../models/webhooks');

const RESET_PASSWORD = process.env.RESET_PASSWORD;

router.get('/', function(req,res,next){
  return res.json({
    running: true
  });
});

router.get('/webhooks', function(req,res,next){
  const qry = webhookModel.find({channel: {'$exists': true}}, {'channel': 1, '_id': 0}).sort({_id: -1});
  qry.exec(function(err, result){
    if(err){
      return next(err);
    }

    return res.json(result);
  });
});

router.get('/webhooks/:id', function(req,res,next){
  webhookModel.find({ channel: req.params.id }, function(err, result){
    if(err){
      return next(err);
    }
    return res.json(result);
  });
});

router.all('/webhooks/:id', function(req, res, next) {
  let obj = {};

  webhookModel.create({
    channel: req.params.id, 
    body: req.body, 
    headers: req.headers, 
    requestMethod: 
    req.method
  }, function(err){
    if(err){
      return next(new Error('cannot write webhook to database'));
    }
    return res.send('Success');
  });
});

router.post('/reset/:id', async function(req,res,next){
  if(req.body.password === RESET_PASSWORD){
    try {
      await webhookModel.remove({channel: req.params.id});
      return res.send('Reset ' + req.params.id);
    }catch(err){
      return next(err);
    }
  }
  return res.send('Fa-eye-lure (Failure)');
});

module.exports = router;
