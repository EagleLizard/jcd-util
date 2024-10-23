
import { JcdImageDto, JcdImageDtoType } from '../jcd-dto/jcd-image-dto';
import { DbClient } from '../../lib/postgres-client';

export const JcdImage = {
  getByPath: getImageByPath,
  insert: insertImage,
} as const;

async function getImageByPath(client: DbClient, opts: {
  path: string;
}): Promise<JcdImageDtoType | undefined> {
  let queryStr = `
    SELECT * FROM jcd_image ji
      WHERE ji.path LIKE $1
  `;
  let res = await client.query(queryStr, [
    opts.path,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let jcdImageDto = JcdImageDto.deserialize(res.rows[0]);
  return jcdImageDto;
}

async function insertImage(client: DbClient, opts: {
  path: string;
}): Promise<JcdImageDtoType> {
  let queryStr = `
    INSERT INTO jcd_image (path)
      values($1)
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.path,
  ]);
  let jcdImageDto = JcdImageDto.deserialize(res.rows[0]);
  return jcdImageDto;
}
