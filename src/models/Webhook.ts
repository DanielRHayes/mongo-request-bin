import { Schema, model } from 'mongoose';

const schema = new Schema({
  bucket: { type: String },
  method: { type: String },
  timestamp: { type: Date, default: Date.now },
  body: { type: Schema.Types.Mixed },
  headers: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
});

export const WebhookModel = model('Webhook', schema);
