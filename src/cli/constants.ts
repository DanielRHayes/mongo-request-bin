export const REMOTE_URL = 'https://danielrhayes-request-bin.herokuapp.com';

export enum Bucket {
  TPrimeMain = 'tprime-main',
  TPrimeManco = 'tprime-manco',
}

export interface IBucketConfig {
  bucket: Bucket;
  forwardUrl: string;
}

export const BUCKET_CONFIG: IBucketConfig[] = [
  {
    bucket: Bucket.TPrimeMain,
    forwardUrl: 'https://angel.dev/treasury-prime-webhook',
  },
  {
    bucket: Bucket.TPrimeManco,
    forwardUrl: 'https://angel.dev/treasury-prime-webhook-manco',
  },
];
