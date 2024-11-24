
import sourceMapSupport from 'source-map-support'
sourceMapSupport.install();

import { imgProcMain } from './img-proc/img-proc';
import { jcdDbV4Main } from './jcd-data/jcd-db-v4/jcd-db-v4';
import { jcdV4ApiMain } from './jcd-api/jcd-v4-api';
import { jcdS3Main } from './jcd-storage/jcd-s3-main';
import { jcdGcpStorageMain } from './jcd-storage/jcd-gcp-storage-main';

(async () => {
  try {
    await main();
  } catch(e) {
    console.error(e);
    throw e;
  }
})()

async function main() {
  let cmd: string;
  let cmdArgs: string[];
  cmd = process.argv[2];
  cmdArgs = process.argv.slice(3);
  switch(cmd) {
    case 'i':
    case 'img':
      await imgProcMain(cmdArgs);
      break;
    case 's3':
      await jcdS3Main(cmdArgs);
      break;
    case 'gcp-storage':
    case 'gcs':
      await jcdGcpStorageMain(cmdArgs);
      break;
    case 'db':
      await jcdDbV4Main();
      break;
    case 'api':
      await jcdV4ApiMain(cmdArgs);
      break;
    default:
      throw new Error(`Invalid cmd: ${cmd}`);
  }
  // console.log(process.argv[2]);
}
/*
2983144	./out/jcd-img-v4
_*/
