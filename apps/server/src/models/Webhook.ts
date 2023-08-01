import { Schema, model, HydratedDocument, Model } from 'mongoose';

// constants
// enums
// types

export interface IWebhook {
  bucket: string;
  method: string;
  receivedDateTime: Date;
  body: any;
  headers: any;
  ipAddress: string;

  // automatically added by mongoose via timestamps: true
  createdAt: Date;
  updatedAt: Date;
}

// schema

const schema = new Schema<IWebhook>(
  {
    bucket: { type: String, required: true },
    method: { type: String, required: true },
    receivedDateTime: { type: Date, default: Date.now },
    body: { type: Schema.Types.Mixed },
    headers: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

// constants
// enums
// types

// methods
export interface IMethods {}

// hooks
// indexes
schema.index({ bucket: 1, receivedDateTime: -1 });

// exports
export const MODEL_NAME = 'Webhook';
export type WebhookDocument = HydratedDocument<IWebhook, IMethods>;
export const WebhookModel = model<IWebhook, Model<IWebhook, {}, IMethods>>(MODEL_NAME, schema);
