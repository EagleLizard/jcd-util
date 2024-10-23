
import { JcdProjectImageDto, JcdProjectImageDtoType, JcdProjectImageJoinDto } from '../jcd-dto/jcd-project-image-dto';
import { DbClient } from '../../lib/postgres-client';

export const JcdProjectImage = {
  getAllByProject: getJcdImagesByProjectId,
  get: getJcdProjectImage,
  insert: insertJcdProjectImage,
} as const;

async function getJcdImagesByProjectId(client: DbClient, opts: {
  jcd_project_id: number;
}) {
  let queryStr = `
    SELECT ji.path, jpis.sort_order, jpi.* FROM jcd_project_image jpi
      INNER JOIN jcd_image ji
        ON jpi.jcd_image_id = ji.jcd_image_id
      INNER JOIN jcd_project_image_sort jpis
        ON jpi.jcd_project_image_id = jpis.jcd_project_image_id
    WHERE jpi.jcd_project_id = $1
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
  ]);
  let jcdProjectImageJoinDtos = res.rows.map(JcdProjectImageJoinDto.deserialize);
  return jcdProjectImageJoinDtos;
}

async function getJcdProjectImage(client: DbClient, opts: {
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

async function insertJcdProjectImage(client: DbClient, opts: {
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

