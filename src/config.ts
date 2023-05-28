import * as dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error('MONGO_URI is required');
}

export const PORT = process.env.PORT || '8080';
export const PASSWORD = process.env.PASSWORD;
export const FORWARD_PROXY_URL = process.env.FORWARD_PROXY_URL;
export const FORWARD_FROM_BUCKET = process.env.FORWARD_FROM_BUCKET;
export const FORWARD_TO_URL = process.env.FORWARD_TO_URL;
