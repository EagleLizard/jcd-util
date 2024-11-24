
import path from 'path';
import fs from 'fs';

import { HeadObjectCommand, HeadObjectCommandOutput, NotFound, PutObjectCommand, PutObjectOutput } from '@aws-sdk/client-s3';
import { AwsS3Client } from '../lib/aws-s3-client';

import { config } from '../config';
import { ImgFiles } from '../img-proc/img-files';
import { Hasher } from '../util/hasher';

const VALID_S3_EXTNAMES = [
  ...ImgFiles.VALID_IMAGE_EXTNAMES,
  '.json',
];

export async function jcdS3Main(cmdArgs: string[]) {
  let srcDirPath: string;
  console.log('jcd s3');
  console.log({ cmdArgs });
  let dirArg = cmdArgs.at(0);
  if(dirArg === undefined) {
    throw new Error('s3 command expects at least one arg');
  }
  if(!path.isAbsolute(dirArg)) {
    srcDirPath = path.resolve(process.cwd(), dirArg);
  } else {
    srcDirPath = dirArg;
  }
  console.log({ srcDirPath });
  let prefix = cmdArgs.at(1) ?? path.basename(srcDirPath);
  console.log({ prefix });
  let filesToUpload = await ImgFiles.getFiles(srcDirPath, {
    validExtNames: VALID_S3_EXTNAMES,
  });
  for(let i = 0; i < filesToUpload.length; ++i) {
    let currFilePath = filesToUpload[i];
    let currBucketKey = [
      prefix,
      path.relative(srcDirPath, currFilePath),
    ].join(path.sep);
    await upsertFile(currFilePath, currBucketKey);
    // console.log(`${currBucketKey}`);
  }
}

async function upsertFile(filePath: string, objectKey: string) {
  console.log(filePath);
  console.log(objectKey);
  let s3Client = AwsS3Client.getAwsS3Client({
    region: config.EZD_API_AWS_REGION
  });
  let headObjCmd = new HeadObjectCommand({
    Bucket: config.EZD_API_BUCKET_KEY,
    Key: objectKey,
  });
  let headObjResp: HeadObjectCommandOutput | undefined;
  try {
    headObjResp = await s3Client.send(headObjCmd);
  } catch(e) {
    if(!(e instanceof NotFound)) {
      throw e;
    }
  }
  if(headObjResp === undefined) {
    let fileStats = fs.statSync(filePath);
    let rs = fs.createReadStream(filePath);
    let contentType = ImgFiles.getMimeType(filePath);
    let sha1 = await Hasher.hashFile(filePath, { alg: 'sha1' });

    let putObjCmd = new PutObjectCommand({
      Key: objectKey,
      Bucket: config.EZD_API_BUCKET_KEY,
      Body: rs,
      ContentLength: fileStats.size,
      ContentType: contentType,
      Metadata: {
        sha1,
      }
    });
    let putObjResp: PutObjectOutput | undefined;
    putObjResp = await s3Client.send(putObjCmd);
    console.log('putObjResp');
    console.log(putObjResp);
  }
  console.log({ headObjResp });
}
