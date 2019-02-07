"use strict";
const io = require("socket.io-client");
const port = process.env.PORT || 3000;
const socket = io(`http://localhost:${port}`);
const request = require("request");

let bucketName = process.argv[2];
let url = process.argv[3];

socket.on("webhook", webhook => {
  console.log("there is a webhook:", webhook);
  if (bucketName === webhook.bucket) {
      console.log("there is a match");
    request.post(
      {
        //forwarding url
        url,
        body: webhook,
        json: true
      },
      function(error, response, body) {
        console.log(body);
      }
    );
  }
});
