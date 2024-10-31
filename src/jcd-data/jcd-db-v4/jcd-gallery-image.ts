
import { QueryResult } from 'pg';
import { DbClient } from '../../lib/postgres-client';
import { JcdGalleryImageDto, JcdGalleryImageDtoType } from '../jcd-dto/jcd-gallery-image-dto';

export const JcdGalleryImage = {
  get: getGalleryImage,
  insert: insertGalleryImage,
} as const;

async function getGalleryImage(client: DbClient, opts: {
  jcd_gallery_id: number;
  jcd_image_id: number;
  kind: JcdGalleryImageDtoType['kind'];
}) {
  let queryStr = `
    SELECT * FROM jcd_gallery_image jgi
    WHERE jgi.jcd_gallery_id = $1
      AND jgi.jcd_image_id = $2
      AND jgi.kind = $3
    ORDER BY jgi.last_modified DESC
    LIMIT 1
  `;
  let res = await client.query(queryStr, [
    opts.jcd_gallery_id,
    opts.jcd_image_id,
    opts.kind,
  ]);
  if(res.rows.length < 1) {
    return undefined;
  }
  let jcdGalleryImageDto = JcdGalleryImageDto.deserialize(res.rows[0]);
  return jcdGalleryImageDto;
}

async function insertGalleryImage(client: DbClient, opts: {
  jcd_gallery_id: number;
  jcd_image_id: number;
  kind: JcdGalleryImageDtoType['kind'];
  sort_order: number;
}) {
  await shiftJcdGalleryImageSort(client, {
    jcd_gallery_id: opts.jcd_gallery_id,
    sort_order: opts.sort_order,
  });
  let colNames = [
    'jcd_gallery_id',
    'jcd_image_id',
    'kind',
    'sort_order',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_gallery_image (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.jcd_gallery_id,
    opts.jcd_image_id,
    opts.kind,
    opts.sort_order,
  ]);
  let jcdGalleryImageDto = JcdGalleryImageDto.deserialize(res.rows[0]);
  return jcdGalleryImageDto;
}

async function shiftJcdGalleryImageSort(client: DbClient, opts: {
  jcd_gallery_id: number;
  sort_order: number;
  shiftBy?: number;
}) {
  let queryStr: string;
  let res: QueryResult;
  let shiftBy = opts.shiftBy ?? 1;

  /*
    lock rows we are going to update.
    todo:xxx: is this needed?
  _*/
  queryStr = `
    SELECT * FROM jcd_gallery_image jgi
      WHERE jgi.jcd_gallery_id = $1
        AND jgi.sort_order >= $2
    FOR UPDATE
  `;
  await client.query(queryStr, [
    opts.jcd_gallery_id,
    opts.sort_order,
  ]);
  queryStr = `
    UPDATE jcd_gallery_image
      SET sort_order = sort_order + $1
      WHERE jcd_gallery_id = $2
        AND sort_order >= $3
    returning *
  `;
  res = await client.query(queryStr, [
    shiftBy,
    opts.jcd_gallery_id,
    opts.sort_order,
  ]);
  return res;
}
