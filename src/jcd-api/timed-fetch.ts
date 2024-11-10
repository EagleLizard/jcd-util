import { Timer } from '../util/timer';

type FetchRes = {} & {
  url: string;
  responseTime: number;
};

export class TimedFetch {
  resultMap: Map<string, FetchRes[]>;
  constructor() {
    this.resultMap = new Map();
  }

  async fetchJson(url: string) {
    let startTime = process.hrtime.bigint();
    let res = await fetch(url);
    let data = await res.json();
    let responseTime = Timer.getDeltaMs(startTime, process.hrtime.bigint());
    this.addResult(url, {
      url,
      responseTime,
    });
    return data;
  }

  private addResult(url: string, fetchRes: FetchRes) {
    let resultsArr: FetchRes[] | undefined;
    if((resultsArr = this.resultMap.get(url)) === undefined) {
      resultsArr = [];
      this.resultMap.set(url, resultsArr);
    }
    resultsArr.push(fetchRes);
  }
}
