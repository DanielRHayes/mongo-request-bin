import * as dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is required');
}

export const PASSWORD = process.env.PASSWORD;

export const forwardProxyUrl = process.env.FORWARD_PROXY_URL;
export const forwardFromBucket = process.env.FORWARD_FROM_BUCKET;
export const forwardToUrl = process.env.FORWARD_TO_URL;
export const forwardToBucket = process.env.FORWARD_TO_BUCKET;
