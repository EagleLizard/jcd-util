
import sourceMapSupport from 'source-map-support'
sourceMapSupport.install();

import { imgProcMain } from './img-proc/img-proc';

(async () => {
  try {
    await main();
  } catch(e) {
    console.error(e);
    throw e;
  }
})()

async function main() {

  // console.log(process.argv[2]);
  await imgProcMain(process.argv.slice(2));
}
