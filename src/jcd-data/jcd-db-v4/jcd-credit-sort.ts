import { QueryResult } from 'pg';
import { DbClient } from '../../lib/postgres-client';
import { JcdCreditSortDto } from '../jcd-dto/jcd-credit-sort-dto';

export const JcdCreditSort = {
  insert: insertJcdCreditSort,
} as const;

async function insertJcdCreditSort(client: DbClient, opts: {
  jcd_project_id: number;
  jcd_credit_id: number;
  sort_order: number;
}) {
  await shiftJcdCreditSorts(client, {
    jcd_project_id: opts.jcd_project_id,
    sort_order: opts.sort_order,
  });
  let colNames = [
    'jcd_project_id',
    'jcd_credit_id',
    'sort_order',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_credit_sort (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.jcd_credit_id,
    opts.sort_order,
  ]);
  let jcdCreditSortDtos = res.rows.map(JcdCreditSortDto.deserialize);
  return jcdCreditSortDtos;
}

async function shiftJcdCreditSorts(client: DbClient, opts: {
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
    SELECT * FROM jcd_credit_sort jcs
      WHERE jcs.jcd_project_id = $1
        AND jcs.sort_order >= $2
    FOR UPDATE
  `;
  await client.query(queryStr, [
    opts.jcd_project_id,
    opts.sort_order,
  ]);
  queryStr = `
    UPDATE jcd_credit_sort
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
