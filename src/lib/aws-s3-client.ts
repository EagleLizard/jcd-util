
import {
  ClientDefaults,
  S3Client,
} from '@aws-sdk/client-s3';
import { config } from '../config';

const awsSdkLogger: ClientDefaults['logger']  = {
  info: (...content: any[]) => {
    // console.log('info');
    // console.log(content);
  },
  debug: (...content: any[]) => {
    console.log('debug');
    console.log(content);
  },
  warn: (...content: any[]) => {
    console.log('warn');
    console.log(content);
  },
  error: (...content: any[]) => {
    // console.log('error');
    // console.log(content);
  },
};

export const AwsS3Client = {
  getAwsS3Client,
} as const;

type GetAwsS3ClientOpts = {} & {
  region: string;
};

function getAwsS3Client(opts: GetAwsS3ClientOpts) {
  let accessKeyId = config.EZD_AWS_ACCESS_KEY_ID;
  let secretAccessKey = config.EZD_AWS_SECRET_ACCESS_KEY;
  if(accessKeyId === undefined) {
    throw new Error('missing access key id');
  }
  if(secretAccessKey === undefined) {
    throw new Error('missing secret access key');
  }
  let s3Cllient = new S3Client({
    region: opts.region,
    logger: awsSdkLogger,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  return s3Cllient;
}
