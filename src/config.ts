
import dotenv from 'dotenv';
import { isString } from './util/validate-primitives';
dotenv.config();

const config = {
  POSTGRES_HOST: process.env.POSTGRES_HOST ?? 'localhost',
  POSTGRES_PORT: getNumberEnvVar('POSTGRES_PORT'),
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,

  EZD_AWS_ACCESS_KEY_ID: process.env.EZD_AWS_ACCESS_KEY_ID,
  EZD_AWS_SECRET_ACCESS_KEY: process.env.EZD_AWS_SECRET_ACCESS_KEY,
  EZD_API_AWS_REGION: 'us-west-2',
  EZD_API_BUCKET_KEY: 'ezd-api-us-west-2-297608881144',
} as const;

export {
  config,
};

function getEnvVarOrErr(envKey: string): string {
  let rawEnvVar: string | undefined;
  rawEnvVar = process.env[envKey];
  if(!isString(rawEnvVar)) {
    throw new Error(`Invalid ${envKey}`);
  }
  return rawEnvVar;
}

function getNumberEnvVar(envKey: string): number {
  let rawPort: string;
  let portNum: number;
  rawPort = getEnvVarOrErr(envKey);
  portNum = +rawPort;
  if(isNaN(portNum)) {
    throw new Error(`invalid env var ${envKey}, expected 'number'`);
  }
  return portNum;
}
