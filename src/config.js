const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error('mongoUri is required');
}

module.exports = {
  mongoUri,
  password: process.env.PASSWORD,
  forwardProxyUrl: process.env.FORWARD_PROXY_URL,
  forwardFromBucket: process.env.FORWARD_FROM_BUCKET,
  forwardToUrl: process.env.FORWARD_TO_URL,
};
