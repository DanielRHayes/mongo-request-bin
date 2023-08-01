import mongoose from 'mongoose';
import { MONGO_URI } from './config';
import { logger } from './logger';

export async function start() {
  logger.info('connecting to mongo...');
  await mongoose.connect(MONGO_URI);
  logger.info('connected to mongo');
}
