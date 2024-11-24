
import path from 'path';

import {
  Bucket,
  Storage,
  File,
  FileMetadata,
} from '@google-cloud/storage';

import { ImgFiles } from '../img-proc/img-files';
import { config } from '../config';
import { Hasher } from '../util/hasher';
import { MetadataResponse } from '@google-cloud/storage/build/cjs/src/nodejs-common';
import { isObject } from '../util/validate-primitives';

const VALID_GCP_STORAGE_EXTNAMES = [
  ...ImgFiles.VALID_IMAGE_EXTNAMES,
  '.json',
];

export async function jcdGcpStorageMain(cmdArgs: string[]) {
  let srcDirPath: string;
  console.log('jcd gcp storage');
  let dirArg = cmdArgs.at(0);
  if(dirArg === undefined) {
    throw new Error('gcp storage command expects at least one arg');
  }
  if(!path.isAbsolute(dirArg)) {
    srcDirPath = path.resolve(process.cwd(), dirArg);
  } else {
    srcDirPath = dirArg;
  }
  console.log({ srcDirPath });
  const prefix = cmdArgs.at(1) ?? path.basename(srcDirPath);
  console.log({ prefix });
  let filesToUpload = await ImgFiles.getFiles(srcDirPath, {
    validExtNames: VALID_GCP_STORAGE_EXTNAMES,
  });
  for(let i = 0; i < filesToUpload.length; ++i) {
    let currFilePath = filesToUpload[i];
    let currBucketKey = [
      prefix,
      path.relative(srcDirPath, currFilePath),
    ].join(path.sep);
    await upsertFile(currFilePath, currBucketKey);
  }
}

async function upsertFile(filePath: string, objectKey: string) {
  let bucket: Bucket;
  let file: File;
  let fileExists: boolean;
  let storageClient = new Storage();
  let sha1: string;

  console.log(filePath);
  console.log(objectKey);
  bucket = storageClient.bucket(config.JCD_IMAGE_V4_GCP_BUCKET);
  file = bucket.file(objectKey);
  [ fileExists ] = await file.exists();
  sha1 = await Hasher.hashFile(filePath, { alg: 'sha1' });

  if(fileExists) {
    let fileMetaRes: MetadataResponse<FileMetadata>;
    fileMetaRes = await file.getMetadata();
    let fileMeta = fileMetaRes[0];
    if(
      isObject(fileMeta.metadata)
      && (fileMeta.metadata.sha1 === sha1)
    ) {
      console.log(`⇥ ${objectKey} already exists, skipping`);
      return;
    }
    console.log(`🔄 Local version of ${objectKey} differs from existing upload, replacing upload with local version...`);
  } else {
    console.log(`💽 New file ${objectKey} not found in uploads, uploading...`);
  }
  let contentType = ImgFiles.getMimeType(filePath);

  await bucket.upload(filePath, {
    destination: objectKey,
    contentType,
    metadata: {
      metadata: {
        sha1,
      },
    },
  });
}
