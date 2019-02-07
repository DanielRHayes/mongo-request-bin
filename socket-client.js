"use strict";
const io = require("socket.io-client");
const port = process.env.PORT || 3000;
const socket = io('https://mongorequestbin.herokuapp.com');
const request = require("request");

const bucketName = process.argv[2];
const forwardingUrl = process.argv[3];

socket.on("webhook", webhook => {
  if (bucketName === webhook.bucket) {
    console.log(`${new Date()} - Received webhook from ${bucketName}`);
    request.post(
      {
        url: forwardingUrl,
        body: webhook.body,
        json: true
      },
      function (err, response, body) {
        if(err){
          console.log(err);
          process.exit(1);
        }
        console.log(`${new Date()} - Successfully forwarded webhook to ${forwardingUrl}`);
      }
    );
  }
});
