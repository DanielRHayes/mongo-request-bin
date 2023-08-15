import request from 'request';
import { io, Socket } from 'socket.io-client';
import { REMOTE_URL, Bucket, IBucketConfig, BUCKET_CONFIG } from '../constants';
import { logger } from '../logger';
import { forwardWebhook } from '../utils/forward';

export class SocketClient {
  public bucket: Bucket;
  public bucketConfig: IBucketConfig;

  private socket: Socket;

  constructor(bucket: Bucket) {
    this.bucket = bucket;
    this.bucketConfig = BUCKET_CONFIG.find((bucketConfig) => bucketConfig.bucket === bucket);

    if (!this.bucketConfig) {
      throw new Error(`Bucket ${bucket} not found in config`);
    }
  }

  public listen() {
    this.socket = io(REMOTE_URL);

    this.socket.on('connect', () => {
      logger.info(`Connected to remote: ${REMOTE_URL} - forwarding to ${this.bucketConfig.forwardUrl}`);
    });

    this.socket.on('disconnect', () => {
      logger.info(`Disconnected from remote: ${REMOTE_URL}`);
    });

    this.socket.on('webhook', async (webhook: any) => {
      const { bucket, body } = webhook;

      // silently ignore webhooks to other buckets
      if (bucket !== this.bucket) {
        return;
      }

      logger.info(body, `Received webhook - attempting to forwarding to ${this.bucketConfig.forwardUrl}`);
      try {
        await forwardWebhook(webhook, this.bucketConfig.forwardUrl);
        logger.info(`Successfully forwarded webhook to ${this.bucketConfig.forwardUrl}`);
      } catch (err) {
        logger.error(err, `Error forwarding webhook to ${this.bucketConfig.forwardUrl}`);
      }
    });
  }
}
