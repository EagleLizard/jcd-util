
import { QueryResult } from 'pg';
import { DbClient } from '../../lib/postgres-client';
import { JcdProjectSortDto, JcdProjectSortDtoType } from '../jcd-dto/jcd-project-sort-dto';
import { JcdProjectSortKeyDto } from '../jcd-dto/jcd-project-sort-key-dto';

export const JcdProjectSort = {
  get: getJcdProjectSort,
  getProjectSorts: getJcdProjectSorts,
  getByOrder: getJcdProjectSortByOrder,
  insert: insertJcdProjectSort,
  update: updateJcdProjectSort,
} as const;

async function getJcdProjectSort(client: DbClient, opts: {
  jcd_project_id: number;
}): Promise<JcdProjectSortDtoType | undefined> {
  let queryStr = `
    SELECT * FROM jcd_project_sort jps
      WHERE jps.jcd_project_id = $1
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let jcdProjectSortDto = JcdProjectSortDto.deserialize(res.rows[0]);
  return jcdProjectSortDto;
}

/*
  Returns the jcd_project_sort rows with respect project keys
_*/
async function getJcdProjectSorts(client: DbClient) {
  let queryStr = `
    SELECT jp.project_key, jps.* FROM jcd_project_sort jps
      INNER JOIN jcd_project jp
        ON jps.jcd_project_id = jp.jcd_project_id
    ORDER BY sort_order ASC
  `;
  let res = await client.query(queryStr);
  let jcdProjectSortKeyDtos = res.rows.map(JcdProjectSortKeyDto.deserialize);
  return jcdProjectSortKeyDtos;
}

async function getJcdProjectSortByOrder(client: DbClient, opts: {
  sort_order: number;
}): Promise<JcdProjectSortDtoType | undefined> {

  let queryStr = `
    SELECT * FROM jcd_project_sort jps
      WHERE jps.sort_order = $1
  `;
  let res = await client.query(queryStr, [
    opts.sort_order,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let jcdProjectSortDto = JcdProjectSortDto.deserialize(res.rows[0]);
  return jcdProjectSortDto;
}

async function insertJcdProjectSort(client: DbClient, opts: {
  jcd_project_id: number;
  sort_order: number;
}): Promise<JcdProjectSortDtoType> {

  await shiftJcdProjectSorts(client, {
    sort_order: opts.sort_order,
  });

  let colNames = [
    'jcd_project_id',
    'sort_order',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_project_sort (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.sort_order,
  ]);
  let jcdProjectSortDto = JcdProjectSortDto.deserialize(res.rows[0]);
  return jcdProjectSortDto;
}

async function updateJcdProjectSort(client: DbClient, opts: {
  jcd_project_id: number;
  jcd_project_sort_id: number;
  sort_order: number;
}): Promise<JcdProjectSortDtoType> {
  await shiftJcdProjectSorts(client, {
    sort_order: opts.sort_order,
  });
  let queryStr = `
    UPDATE jcd_project_sort
      SET sort_order = $1
      WHERE jcd_project_id = $2
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.sort_order,
    opts.jcd_project_id,
  ]);
  let jcdProjectSortDto = JcdProjectSortDto.deserialize(res.rows[0]);
  return jcdProjectSortDto;
}

async function shiftJcdProjectSorts(client: DbClient, opts: {
  shiftBy?: number;
  sort_order: number;
}) {
  let queryStr: string;
  let res: QueryResult;
  opts.shiftBy = opts.shiftBy ?? 1;
  /*
    lock rows we are going to update.
    todo:xxx: is this needed?
  _*/
  queryStr = `
    SELECT * FROM jcd_project_sort jps
      WHERE jps.sort_order >= $1
    ORDER BY jps.sort_order DESC
    FOR UPDATE
  `;
  res = await client.query(queryStr, [
    opts.sort_order,
  ]);
  queryStr = `
    UPDATE jcd_project_sort
      SET sort_order = sort_order + $1
      WHERE sort_order >= $2
    returning *
  `;
  res = await client.query(queryStr, [
    opts.shiftBy,
    opts.sort_order,
  ]);
  return res;
}
