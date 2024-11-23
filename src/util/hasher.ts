
import { createHash, Hash, HashOptions } from 'crypto';
import { createReadStream, ReadStream } from 'fs';

const DEFAULT_ALG = 'sha1';
// const DEFAULT_ALG = 'md5';
const outputFormat = 'hex';

type Hasher = {
  update(data: string | Buffer | NodeJS.TypedArray | DataView): void;
  // update(data: string, input_encoding: Utf8AsciiLatin1Encoding): void;
  digest: () => string;
};

type HashFileOpts = {
  alg?: 'sha1' | 'sha256' | 'sha512';
}

export const Hasher = {
  getHasher,
  hashSync,
  hashFile,
} as const;

function getHasher(hashOpts: HashFileOpts = {}): Hasher {
  let hash: Hash;
  let alg = hashOpts.alg ?? DEFAULT_ALG;

  hash = createHash(alg);

  return {
    update,
    digest,
  };

  function update(data: string | Buffer | NodeJS.TypedArray | DataView) {
    hash.update(data);
  }
  function digest() {
    return hash.digest(outputFormat);
  }
}

function hashSync(data: string) {
  let hasher: Hasher;
  hasher = getHasher();
  hasher.update(data);
  return hasher.digest();
}

async function hashFile(filePath: string, opts: HashFileOpts = {}): Promise<string> {
  let hashStr: string;
  let hasher: Hasher;
  let rs: ReadStream;

  hasher = getHasher(opts);
  rs = createReadStream(filePath);

  const chunkCb = (chunk: string | Buffer) => {
    hasher.update(chunk);
  };

  await new Promise((resolve, reject) => {
    rs.on('error', reject);
    rs.on('close', resolve);
    rs.on('data', chunkCb);
  });

  hashStr = hasher.digest();
  return hashStr;
}
