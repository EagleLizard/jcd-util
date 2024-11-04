
import fsp from 'fs/promises';
import path from 'path';
import { Dirent } from 'fs';
import os from 'os';

import sharp from 'sharp';

import { checkDir, mkdirIfNotExist } from '../util/files';
import { OUT_DIR } from '../constants';
import { Timer } from '../util/timer';
import { getIntuitiveTimeString } from '../util/format-util';

enum RESIZE_FMT_ENUM {
  LARGE = 'LARGE',
  X_LARGE = 'X_LARGE',
  MEDIUM = 'MEDIUM',
  SMALL = 'SMALL',
  X_SMALL = 'X_SMALL',
}

type ResizeFmt = {} & {
  kind: RESIZE_FMT_ENUM;
  prefix: string;
  width: number;
  height: number;
};

const MAX_RUNNING_RESIZES = Math.max(os.cpus().length - 1, 2);

const RESIZE_FMT_MAP: Record<RESIZE_FMT_ENUM, ResizeFmt> = {
  [RESIZE_FMT_ENUM.X_LARGE]: {
    kind: RESIZE_FMT_ENUM.X_LARGE,
    prefix: 'xl',
    // width: 2048,
    // height: 2160,

    width: 2560,
    height: 2700,
  },
  [RESIZE_FMT_ENUM.LARGE]: {
    kind: RESIZE_FMT_ENUM.LARGE,
    prefix: 'lg',
    // width: 1400,
    // height: 1477,

    // width: 1366,
    // height: 1441,

    // width: 1600,
    // height: 1688,

    width: 1920,
    height: 2025,

    // width: 1920, /* 0.75 * xl */
    // height: 2025, /* width * 1.0546875 */
  },
  [RESIZE_FMT_ENUM.MEDIUM]: {
    kind: RESIZE_FMT_ENUM.MEDIUM,
    prefix: 'md',

    width: 1366,
    height: 1441,

    // width: 960,
    // height: 1013,

    // width: 960,
    // height: 1013,

    // width: 768,
    // height: 810,
  },
  [RESIZE_FMT_ENUM.SMALL]: {
    kind: RESIZE_FMT_ENUM.SMALL,
    prefix: 'sm',
    width: 854,
    height: 901,

    // width: 666,
    // height: 702,
  },
  [RESIZE_FMT_ENUM.X_SMALL]: {
    kind: RESIZE_FMT_ENUM.X_SMALL,
    prefix: 'xs',
    width: 666,
    height: 702,

    // width: 360,
    // height: 380,
  }
};

const VALID_EXTNAMES = [ '.jpg', '.jpeg', '.png' ];

export async function imgProcMain(cmdArgs: string[]) {
  let outDirName: string;
  let outDirPath: string;
  let fmtKinds: RESIZE_FMT_ENUM[];
  console.log('imgProc');
  console.log('cmdArgs:');
  console.log(cmdArgs);
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
    RESIZE_FMT_ENUM.X_SMALL,
  ];

  let timer = Timer.start();
  for(let i = 0; i < fmtKinds.length; ++i) {
    let currFmt = RESIZE_FMT_MAP[fmtKinds[i]];
    await resizeImages(imageFilePaths, {
      resizeFmt: currFmt,
      imageDir: imgDir,
      outDirPath,
    });
  }
  let elapsedMs = timer.stop();
  console.log(`took: ${getIntuitiveTimeString(elapsedMs)}`);
}

type ResizeImageOpts = {
  resizeFmt: ResizeFmt;
  imageDir: string;
  outDirPath: string;
};

async function resizeImages(imagePaths: string[], opts: ResizeImageOpts) {
  console.log(opts.resizeFmt.kind);
  console.log(`${opts.resizeFmt.prefix}: ${opts.resizeFmt.width}x${opts.resizeFmt.height}`);

  let running = 0;

  for(let i = 0; i < imagePaths.length; ++i) {
    while(running >= MAX_RUNNING_RESIZES) {
      await sleep(10);
    }
    running++;
    resizeImage(imagePaths[i], opts).then(() => {
      process.stdout.write('.');
    }).finally(() => {
      running--;
    });
  }
  while(running > 0) {
    await sleep(10);
  }
  console.log('');
  process.stdout.write('\n');
}

async function resizeImage(imagePath: string, opts: ResizeImageOpts) {
  let resizeFmt = opts.resizeFmt;
  let imageDir = opts.imageDir;
  let relPath = path.relative(imageDir, imagePath);
  let fmtPath = [ resizeFmt.prefix, relPath ].join(path.sep);
  let outPath = [ opts.outDirPath, fmtPath ].join(path.sep);

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

function sleep(ms = 0) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
