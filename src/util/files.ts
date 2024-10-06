
import fs, { Stats } from 'fs';

import { isObject } from './validate-primitives';

export function checkDir(dirPath: string): boolean {
  let stats: Stats;
  try {
    stats = fs.statSync(dirPath);
  } catch(e) {
    // if(e?.code === 'ENOENT') {
    if(isObject(e) && e.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }
  return stats.isDirectory();
}
