import { isPromise } from './validate-primitives';

export class Timer {

  private constructor(
    private startTime: bigint,
    private endTime?: bigint,
  ) {}

  static start(): Timer {
    let timer: Timer, startTime: bigint;
    startTime = process.hrtime.bigint();
    timer = new Timer(startTime);
    return timer;
  }

  startTimeMs(): number {
    return Number(this.startTime / BigInt(1e3));
  }
  stop(): number {
    let endTime: bigint, deltaMs: number;
    endTime = process.hrtime.bigint();
    this.endTime = endTime;
    deltaMs = Timer.getDeltaMs(this.startTime, this.endTime);
    return deltaMs;
  }
  currentMs(): number {
    return Timer.getDeltaMs(this.startTime, process.hrtime.bigint());
  }
  reset() {
    this.startTime = process.hrtime.bigint();
  }

  static getDeltaMs(start: bigint, end: bigint): number {
    return Number((end - start) / BigInt(1e3)) / 1e3;
  }

  static async runAndTime<T>(fn: () => T | Promise<T>): Promise<[T, number]> {
    let startTime = process.hrtime.bigint();
    let res = fn();
    if(isPromise(res)) {
      res = await res;
    }
    let deltaMs = Timer.getDeltaMs(startTime, process.hrtime.bigint());
    return [ res, deltaMs ];
  }
}
