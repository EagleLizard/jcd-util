import { PoolClient } from 'pg';
import { JcdImageDto, JcdImageDtoType } from '../jcd-dto/jcd-image-dto';
import { JcdProjectImageDto, JcdProjectImageDtoType } from '../jcd-dto/jcd-project-image-dto';

export const JcdImage = {
  getByPath: getImageByPath,
  insert: insertImage,
} as const;

export const JcdProjectImage = {
  get: getJcdProjectImage,
  insert: insertJcdProjectImage,
} as const;

async function getImageByPath(client: PoolClient, opts: {
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

async function insertImage(client: PoolClient, opts: {
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

async function getJcdProjectImage(client: PoolClient, opts: {
  jcd_project_id: number;
  jcd_image_id: number;
  kind: JcdProjectImageDtoType['kind'];
}): Promise<JcdProjectImageDtoType | undefined> {
  let querysStr = `
    SELECT jpi.* FROM jcd_project jp
      INNER JOIN jcd_project_image jpi
        ON jp.jcd_project_id = jpi.jcd_project_id
      INNER JOIN jcd_image ji
        ON ji.jcd_image_id = jpi.jcd_image_id
    WHERE jpi.jcd_project_id = $1
      AND jpi.jcd_image_id = $2
      AND jpi.kind = $3
    ORDER BY jpi.last_modified DESC
  `;
  let res = await client.query(querysStr, [
    opts.jcd_project_id,
    opts.jcd_image_id,
    opts.kind,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let jcdProjectImageDto = JcdProjectImageDto.deserialize(res.rows[0]);
  return jcdProjectImageDto;
}

async function insertJcdProjectImage(client: PoolClient, opts: {
  jcd_project_id: number;
  jcd_image_id: number;
  kind: JcdProjectImageDtoType['kind'];
}): Promise<JcdProjectImageDtoType> {
  let colNames = [
    'jcd_project_id',
    'jcd_image_id',
    'kind',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_project_image (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.jcd_image_id,
    opts.kind,
  ]);
  let jcdProjectImageDto = JcdProjectImageDto.deserialize(res.rows[0]);
  return jcdProjectImageDto;
}
