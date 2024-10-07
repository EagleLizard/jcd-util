
import fsp from 'fs/promises';
import path from 'path';
import { Dirent } from 'fs';

import sharp from 'sharp';

import { checkDir, mkdirIfNotExist } from '../util/files';
import { BASE_DIR, OUT_DIR } from '../constants';

enum RESIZE_FMT_ENUM {
  LARGE = 'LARGE',
  X_LARGE = 'X_LARGE',
  MEDIUM = 'MEDIUM',
  SMALL = 'SMALL',
}

type ResizeFmt = {
  kind: RESIZE_FMT_ENUM;
  prefix: string;
  width: number;
  height: number;
};

const RESIZE_FMT_MAP: Record<RESIZE_FMT_ENUM, ResizeFmt> = {
  [RESIZE_FMT_ENUM.X_LARGE]: {
    kind: RESIZE_FMT_ENUM.X_LARGE,
    prefix: 'xl',
    width: 2048,
    height: 2160,
  },
  [RESIZE_FMT_ENUM.LARGE]: {
    kind: RESIZE_FMT_ENUM.LARGE,
    prefix: 'lg',
    width: 1920,
    height: 1600,
  },
  [RESIZE_FMT_ENUM.MEDIUM]: {
    kind: RESIZE_FMT_ENUM.MEDIUM,
    prefix: 'md',
    width: 768,
    height: 640,
  },
  [RESIZE_FMT_ENUM.SMALL]: {
    kind: RESIZE_FMT_ENUM.SMALL,
    prefix: 'sm',
    width: 500,
    height: 400,
  },
};

const VALID_EXTNAMES = [ '.jpg', '.jpeg', '.png' ];

export async function imgProcMain(cmdArgs: string[]) {
  let outDirName: string;
  let outDirPath: string;
  let fmtKinds: RESIZE_FMT_ENUM[];
  console.log('imgProc');
  if(cmdArgs.length < 1) {
    throw new Error('imgProc expected at least one command arg');
  }
  let imgDir = cmdArgs[0]; // simple args for now
  console.log({ dir: imgDir });
  let imageFilePaths = await getImageFiles(imgDir);
  outDirName = path.basename(imgDir);
  outDirPath = [ OUT_DIR, outDirName ].join(path.sep);
  console.log({ outDirPath });
  mkdirIfNotExist(outDirPath, {
    recursive: true,
  });

  fmtKinds = [
    RESIZE_FMT_ENUM.X_LARGE,
    RESIZE_FMT_ENUM.LARGE,
    RESIZE_FMT_ENUM.MEDIUM,
    RESIZE_FMT_ENUM.SMALL,
  ];
  for(let i = 0; i < fmtKinds.length; ++i) {
    let currFmt = RESIZE_FMT_MAP[fmtKinds[i]];
    await resizeImages(imageFilePaths, {
      resizeFmt: currFmt,
      imageDir: imgDir,
      outDirPath,
    });
  }
}

type ResizeImageOpts = {
  resizeFmt: ResizeFmt;
  imageDir: string;
  outDirPath: string;
};

async function resizeImages(imagePaths: string[], opts: ResizeImageOpts) {
  console.log(opts.resizeFmt.kind);
  for(let i = 0; i < imagePaths.length; ++i) {
    // console.log(imagePaths[i]);
    await resizeImage(imagePaths[i], opts);
  }
}

async function resizeImage(imagePath: string, opts: ResizeImageOpts) {
  let resizeFmt = opts.resizeFmt;
  let imageDir = opts.imageDir;
  let relPath = path.relative(imageDir, imagePath);
  let fmtPath = [ resizeFmt.prefix, relPath ].join(path.sep);
  let outPath = [ opts.outDirPath, fmtPath ].join(path.sep);
  console.log(fmtPath);
  // console.log(outPath);
  // console.log(path.dirname(outPath));
  mkdirIfNotExist(path.dirname(outPath), {
    recursive: true,
  });
  // return;
  let sharpTransformer = sharp(imagePath);
  let metadata = await sharpTransformer.metadata();
  if(
    (metadata.format === 'jpg')
    || (metadata.format === 'jpeg')
  ) {
    sharpTransformer = sharpTransformer.jpeg({
      quality: 100,
    });
  }
  // return;
  sharpTransformer = sharpTransformer
    .rotate()
    .resize({
      withoutEnlargement: true,
      fit: sharp.fit.inside,
      width: resizeFmt.width,
      height: resizeFmt.height,
    });
  let sharpPromise = new Promise<void>((resolve, reject) => {
    sharpTransformer.toFile(outPath, (err) => {
      if(err) {
        return reject(err);
      }
      resolve();
    });
  });
  await sharpPromise;
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
