
import { DbClient } from '../../lib/postgres-client';
import { JcdGalleryDto } from '../jcd-dto/jcd-gallery-dto';
import { GalleryDef } from './jcd-v4-galleries';
import { JcdProjectDef } from './jcd-v4-projects';

export const JcdGallery = {
  get: getGalleryByKey,
  insert: insertGallery,
} as const;

async function getGalleryByKey(client: DbClient, galleryKey: string) {
  let queryStr = `
    SELECT * FROM jcd_gallery jg
    WHERE jg.gallery_key LIKE $1
  `;
  let res = await client.query(queryStr, [
    galleryKey,
  ]);
  if(res.rows.length < 1) {
    return undefined;
  }
  if(res.rows.length > 1) {
    throw new Error(`Expected one result for gallery_key '${galleryKey}', found: ${res.rows.length}`);
  }
  let jcdGalleryDto = JcdGalleryDto.deserialize(res.rows[0]);
  return jcdGalleryDto;
}

async function insertGallery(client: DbClient, opts: {
  gallery_key: GalleryDef['gallery_key'] | JcdProjectDef['project_key'];
}) {
  let colNames = [
    'gallery_key',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_gallery (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.gallery_key,
  ]);
  let jcdGalleryDto = JcdGalleryDto.deserialize(res.rows[0]);
  return jcdGalleryDto;
}
