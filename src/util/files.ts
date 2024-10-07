
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

export function mkdirIfNotExist(dirPath: string, opts: {
  recursive?: boolean;
}) {
  let dirExists: boolean;
  dirExists = checkDir(dirPath);
  if(!dirExists) {
    fs.mkdirSync(dirPath, {
      recursive: opts.recursive,
    });
  }
}
