import mongoose from 'mongoose';
import { MONGO_URI } from './config';

export async function startStorage() {
  await mongoose.connect(MONGO_URI);
  console.log('connected to mongo');
}
