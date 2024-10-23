
import { QueryResult } from 'pg';

import { DbClient } from '../../lib/postgres-client';
import { JcdProjectImageSortDto } from '../jcd-dto/jcd-project-image-sort-dto';

export const JcdProjectImageSort = {
  insert: insertJcdProjectImageSort,
} as const;

async function insertJcdProjectImageSort(client: DbClient, opts: {
  jcd_project_id: number;
  jcd_project_image_id: number;
  sort_order: number;
}) {
  await shiftJcdProjectImageSorts(client, {
    jcd_project_id: opts.jcd_project_id,
    sort_order: opts.sort_order,
  });

  let colNames = [
    'jcd_project_id',
    'jcd_project_image_id',
    'sort_order',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_project_image_sort (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.jcd_project_image_id,
    opts.sort_order,
  ]);
  let jcdProjectImageSortDto = JcdProjectImageSortDto.deserialize(res.rows[0]);
  return jcdProjectImageSortDto;
}

async function shiftJcdProjectImageSorts(client: DbClient, opts: {
  jcd_project_id: number;
  sort_order: number;
  shiftBy?: number;
}) {
  let queryStr: string;
  let res: QueryResult;
  opts.shiftBy = opts.shiftBy ?? 1;
  /*
    lock rows we are going to update.
    todo:xxx: is this needed?
  _*/
  queryStr = `
    SELECT * FROM jcd_project_image_sort jpis
      WHERE jpis.jcd_project_id = $1
        AND jpis.sort_order >= $2
    ORDER BY jpis.sort_order DESC
    FOR UPDATE
  `;
  res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.sort_order,
  ]);
  queryStr = `
    UPDATE jcd_project_image_sort
      SET sort_order = sort_order + $1
      WHERE jcd_project_id = $2
        AND sort_order >= $3
    returning *
  `;
  res = await client.query(queryStr, [
    opts.shiftBy,
    opts.jcd_project_id,
    opts.sort_order,
  ]);
  return res;
}
