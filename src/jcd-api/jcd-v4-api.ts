
import { GalleryV4Type } from './gallery-v4';
import { JcdV4ApiClient } from './jcd-v4-api-client';
import { sleep } from '../util/sleep';
import { Timer } from '../util/timer';
import { getIntuitiveTimeString } from '../util/format-util';
import { DatetimeUtil } from '../util/datetime-util';

type TestResult = {} & {
  url: string;
  p99: number;
  p95: number;
  avg: number;
};

export async function jcdV4ApiMain(cmdArgs: string[]) {
  console.log('');
  console.log('='.repeat(70));
  console.log('jcd-api');
  // const testCount = 200;
  const testCount = 300;
  // const testCount = 1000;
  // const testCount = 5000;
  // const testCount = 10_000;

  console.log(DatetimeUtil.getDatetimeStr(new Date()));
  console.log({ testCount });

  let jcdClient = new JcdV4ApiClient();
  let testResults: TestResult[] = [];

  let testsTimer = Timer.start();
  for(let i = 0; i < testCount; ++i) {
    await testGetProjects(jcdClient);
  }
  let testsMs = testsTimer.stop();

  let resultEntries = [ ...jcdClient.timedFetch.resultMap.entries() ];
  for(let i = 0; i < resultEntries.length; ++i) {
    let [ url, fetchResults ] = resultEntries[i];
    let responseTimes: number[] = [];
    // console.log('');
    // console.log(parsedUrl.pathname);
    let responseTimeSum = 0;
    for(let k = 0; k < fetchResults.length; ++k) {
      responseTimeSum += fetchResults[k].responseTime;
      responseTimes.push(fetchResults[k].responseTime);
    }
    let responseTimeAvg = responseTimeSum / fetchResults.length;
    let p99 = getPercentile(responseTimes, 99);
    let p95 = getPercentile(responseTimes, 95);
    let testResult: TestResult = {
      url,
      p99,
      p95,
      avg: responseTimeAvg,
    };
    testResults.push(testResult);
  }
  let sortedTestResults = testResults.toSorted((a, b) => {
    // return a.p95 - b.p95;
    return a.p99 - b.p99;
  });
  sortedTestResults.forEach(testResult => {
    let parsedUrl = new URL(testResult.url);
    console.log('');
    console.log(parsedUrl.pathname);
    console.log(`p99: ${testResult.p99}`);
    console.log(`p95: ${testResult.p95}`);
    console.log(`avg: ${testResult.avg.toFixed(3)}`);
  });
  console.log({ testCount });
  console.log(getIntuitiveTimeString(testsMs));
}

function getPercentile(vals: number[], percentile: number) {
  let pMod = percentile / 100;
  if(pMod > 1 || pMod < 0) {
    throw new Error(`invalid percentile ${percentile}, ${pMod}`);
  }
  let sorted = vals.toSorted((a, b) => a - b);
  let pIdx = Math.floor(sorted.length * pMod);

  return sorted[pIdx];
}

async function testGetProjects(jcdClient: JcdV4ApiClient) {
  let projectInfos = await jcdClient.getProjects();
  for(let i = 0; i < projectInfos.length; ++i) {
    let jcdProj = await jcdClient.getProject(projectInfos[i].route);
  }
  let galleryKeys = [
    ...projectInfos.map(projectInfo => projectInfo.projectKey),
    'ART',
  ];
  for(let i = 0; i < galleryKeys.length; ++i) {
    let galleryKey = galleryKeys[i];
    // let galleryImages = await jcdClient.getGallery(galleryKey);
  }
}
