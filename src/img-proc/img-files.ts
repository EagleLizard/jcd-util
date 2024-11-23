
import path from 'path';
import fsp from 'fs/promises';
import { type Dirent } from 'fs';

import { checkDir } from '../util/files';

const VALID_IMAGE_EXTNAMES = [ '.jpg', '.jpeg', '.png' ];

export const ImgFiles = {
  getFiles,
  VALID_IMAGE_EXTNAMES,
} as const;

type GetImageFilesOpts = {} & {
  validExtNames: string[];
};

async function getFiles(imgDir: string, opts: GetImageFilesOpts): Promise<string[]> {
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
      && opts.validExtNames.includes(path.extname(fullPath).toLowerCase())
    ) {
      imageFilePaths.push(fullPath);
    }
  }

  return imageFilePaths;
}
