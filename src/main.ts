
import sourceMapSupport from 'source-map-support'
sourceMapSupport.install();

import { imgProcMain } from './img-proc/img-proc';
import { jcdDbV4Main } from './jcd-data/jcd-db-v4/jcd-db-v4';

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
    case 'db':
      await jcdDbV4Main();
      break;
    default:
      throw new Error(`Invalid cmd: ${cmd}`);
  }
  // console.log(process.argv[2]);
}
