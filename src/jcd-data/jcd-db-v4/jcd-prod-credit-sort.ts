
import { QueryResult } from 'pg';
import { DbClient } from '../../lib/postgres-client';
import { JcdProdCreditSortDto } from '../jcd-dto/jcd-prod-credit-sort-dto';

export const JcdProdCreditSort = {
  insert: insertJcdProdCreditSort,
} as const;

async function insertJcdProdCreditSort(client: DbClient, opts: {
  jcd_project_id: number;
  jcd_prod_credit_id: number;
  sort_order: number;
}) {
  await shiftJcdProdCreditSorts(client, {
    jcd_project_id: opts.jcd_project_id,
    sort_order: opts.sort_order,
  });
  let colNames = [
    'jcd_project_id',
    'jcd_prod_credit_id',
    'sort_order',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_prod_credit_sort (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.jcd_prod_credit_id,
    opts.sort_order,
  ]);
  let jcdProdCreditSortDtos = JcdProdCreditSortDto.deserialize(res.rows[0]);
  return jcdProdCreditSortDtos;
}

async function shiftJcdProdCreditSorts(client: DbClient, opts: {
  jcd_project_id: number;
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
    SELECT * FROM jcd_prod_credit_sort jpcs
      WHERE jpcs.jcd_project_id = $1
        AND sort_order >= $2
    FOR UPDATE
  `;
  await client.query(queryStr, [
    opts.jcd_project_id,
    opts.sort_order,
  ]);
  queryStr = `
    UPDATE jcd_prod_credit_sort
      SET sort_order = sort_order + $1
      WHERE jcd_project_id = $2
        AND sort_order >= $3
    returning *
  `;
  res = await client.query(queryStr, [
    shiftBy,
    opts.jcd_project_id,
    opts.sort_order,
  ]);
  return res;
}
