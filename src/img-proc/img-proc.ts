
import fsp from 'fs/promises';

import { checkDir } from '../util/files';
import path from 'path';
import { Dirent } from 'fs';

const VALID_EXTNAMES = [ '.jpg', '.jpeg', '.png' ];

export async function imgProcMain(cmdArgs: string[]) {
  console.log('imgProc');
  if(cmdArgs.length < 1) {
    throw new Error('imgProc expected at least one command arg');
  }
  let imgDir = cmdArgs[0]; // simple args for now
  console.log({ dir: imgDir });
  let imageFilePaths = await getImageFiles(imgDir);
  for(let i = 0; i < imageFilePaths.length; ++i) {
    let currImagePath = imageFilePaths[i];
    console.log(path.relative(imgDir, currImagePath));
  }
}

async function getImageFiles(imgDir: string): Promise<string[]> {
  let imageFilePaths: string[];
  let dirEntries: Dirent[];
  if(!checkDir(imgDir)) {
    throw new Error(`${imgDir} is not a dir`);
  }

  imageFilePaths = [];

  dirEntries = await fsp.readdir(imgDir, {
    withFileTypes: true,
    recursive: true,
  });

  for(let i = 0; i < dirEntries.length; ++i) {
    let currDirEntry = dirEntries[i];
    let fullPath = [
      currDirEntry.parentPath,
      currDirEntry.name
    ].join(path.sep);
    if(
      !currDirEntry.isDirectory()
      && VALID_EXTNAMES.includes(path.extname(fullPath).toLowerCase())
    ) {
      imageFilePaths.push(fullPath);
    }
  }

  return imageFilePaths;
}
