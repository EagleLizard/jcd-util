
import path from 'path';
import fs from 'fs';
import os from 'os';

import sharp from 'sharp';

import { mkdirIfNotExist } from '../util/files';
import { OUT_DIR } from '../constants';
import { Timer } from '../util/timer';
import { getIntuitiveTimeString } from '../util/format-util';
import { sleep } from '../util/sleep';
import { ImgSz } from './img-sz';
import { ImgFiles } from './img-files';

enum RESIZE_FMT_ENUM {
  XX_LARGE = 'XX_LARGE',
  X_LARGE = 'X_LARGE',
  LARGE = 'LARGE',
  MEDIUM = 'MEDIUM',
  SMALL = 'SMALL',
  X_SMALL = 'X_SMALL',
}

type ResizeFmt = {} & {
  kind: RESIZE_FMT_ENUM;
  prefix: ImgSz;
  width: number;
  height?: number;
};

const MAX_RUNNING_RESIZES = Math.max(os.cpus().length - 1, 2);

const IMG_FMTS_OUT_FILE_NAME = 'img-fmts.json';

const RESIZE_FMT_MAP: Record<RESIZE_FMT_ENUM, ResizeFmt> = {
  [RESIZE_FMT_ENUM.XX_LARGE]: {
    kind: RESIZE_FMT_ENUM.XX_LARGE,
    prefix: 'xxl',
    width: 2560,
  },
  [RESIZE_FMT_ENUM.X_LARGE]: {
    kind: RESIZE_FMT_ENUM.X_LARGE,
    prefix: 'xl',
    // width: 2048,
    // height: 2160,

    // width: 2560,
    // height: 2700,

    width: 2100,
  },
  [RESIZE_FMT_ENUM.LARGE]: {
    kind: RESIZE_FMT_ENUM.LARGE,
    prefix: 'lg',

    width: 1600,

    // width: 1920,
    // height: 2025,

    // width: 1920, /* 0.75 * xl */
    // height: 2025, /* width * 1.0546875 */
  },
  [RESIZE_FMT_ENUM.MEDIUM]: {
    kind: RESIZE_FMT_ENUM.MEDIUM,
    prefix: 'md',

    width: 1200,

    // width: 1366,
    // height: 1441,
  },
  [RESIZE_FMT_ENUM.SMALL]: {
    kind: RESIZE_FMT_ENUM.SMALL,
    prefix: 'sm',
    width: 800,

    // width: 854,
    // height: 901,

    // width: 666,
    // height: 702,
  },
  [RESIZE_FMT_ENUM.X_SMALL]: {
    kind: RESIZE_FMT_ENUM.X_SMALL,
    prefix: 'xs',
    width: 500,

    // width: 666,
    // height: 702,

    // width: 360,
    // height: 380,
  }
};

const VALID_EXTNAMES = [ '.jpg', '.jpeg', '.png' ];

export async function imgProcMain(cmdArgs: string[]) {
  let imgDirArg: string | undefined;
  let outDirArg: string | undefined;
  let imgDir: string;
  let outDirName: string;
  let outDirPath: string;
  let fmtKinds: RESIZE_FMT_ENUM[];
  console.log('imgProc');
  console.log('cmdArgs:');
  console.log(cmdArgs);
  /*
    simple args for now
  _*/
  imgDirArg = cmdArgs.at(0);
  outDirArg = cmdArgs.at(1);
  if(imgDirArg === undefined) {
    throw new Error('imgProc expects at least one arg');
  }
  imgDir = imgDirArg;
  outDirName = outDirArg ?? path.basename(imgDir);
  console.log({ dir: imgDir });

  let imageFilePaths = await ImgFiles.getFiles(imgDir, {
    validExtNames: VALID_EXTNAMES,
  });
  outDirPath = [ OUT_DIR, outDirName ].join(path.sep);
  console.log({ outDirPath });
  mkdirIfNotExist(outDirPath, {
    recursive: true,
  });

  fmtKinds = [
    RESIZE_FMT_ENUM.XX_LARGE,
    RESIZE_FMT_ENUM.X_LARGE,
    RESIZE_FMT_ENUM.LARGE,
    RESIZE_FMT_ENUM.MEDIUM,
    RESIZE_FMT_ENUM.SMALL,
    RESIZE_FMT_ENUM.X_SMALL,
  ];

  let imgFmts: ResizeFmt[] = [];

  let timer = Timer.start();
  for(let i = 0; i < fmtKinds.length; ++i) {
    let currFmt = RESIZE_FMT_MAP[fmtKinds[i]];
    imgFmts.push(currFmt);
    await resizeImages(imageFilePaths, {
      resizeFmt: currFmt,
      imageDir: imgDir,
      outDirPath,
    });
  }
  let imgFmtsOutFilePath = [ outDirPath, IMG_FMTS_OUT_FILE_NAME ].join(path.sep);
  fs.writeFileSync(imgFmtsOutFilePath, JSON.stringify(imgFmts));
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
      trellisQuantisation: true,
      overshootDeringing: true,
      optimizeScans: true,
      quantizationTable: 3,
      // mozjpeg: true,
      quality: 90,
    });
  } else if(metadata.format === 'png') {
    sharpTransformer = sharpTransformer.png({
      effort: 10,
      compressionLevel: 9,
    });
  }
  let resizeHeight = resizeFmt.height ?? Math.round(resizeFmt.width * 1.0546875);
  // return;
  sharpTransformer = sharpTransformer
    .rotate()
    .resize({
      withoutEnlargement: true,
      fit: sharp.fit.inside,
      width: resizeFmt.width,
      height: resizeHeight,
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
