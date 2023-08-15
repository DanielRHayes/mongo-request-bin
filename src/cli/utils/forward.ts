import request from 'request';

export function forwardWebhook(webhook: any, forwardUrl: string) {
  const reqObj = {
    url: forwardUrl,
    headers: {},
    body: webhook.body,
    json: true,
  };
  
  if (webhook.headers && webhook.headers.authorization) {
    reqObj.headers = { authorization: webhook.headers.authorization };
  }

  return new Promise((resolve, reject) => {
    request.post(reqObj, (err, res, body) => {
      if (err) {
        return reject(err);
      }
      return resolve(body);
    });
  });
}
