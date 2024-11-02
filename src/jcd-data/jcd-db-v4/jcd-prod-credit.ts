
import { JcdCreditDef } from './jcd-v4-projects';
import { JcdProdCreditDto, JcdProdCreditDtoType } from '../jcd-dto/jcd-prod-credit-dto';
import { PersonDto, PersonDtoType } from '../jcd-dto/person-dto';
import { OrgDto, OrgDtoType } from '../jcd-dto/org-dto';
import { JcdProdCreditContribDto, JcdProdCreditContribDtoType } from '../jcd-dto/jcd-prod-credit-contrib-dto';
import { DbClient } from '../../lib/postgres-client';
import { QueryResult } from 'pg';

export const JcdProdCredit = {
  getAllByProject: getAllProdCreditsByProject,
  upsert: upsertJcdProdCredit,
} as const;

export const JcdProdCreditContrib = {
  upsert: upsertJcdProdCreditContrib,
} as const;

async function getAllProdCreditsByProject(client: DbClient, opts: {
  jcd_project_id: number;
}) {
  let queryStr = `
    SELECT jpc.*, jpc.sort_order FROM jcd_prod_credit jpc
      INNER JOIN jcd_project jp
        ON jpc.jcd_project_id = jp.jcd_project_id
    WHERE jpc.jcd_project_id = $1
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
  ]);
  let jcdProdCreditOrderDtos = res.rows.map(JcdProdCreditDto.deserialize);
  return jcdProdCreditOrderDtos;
}

async function upsertJcdProdCredit(client: DbClient, opts: {
  jcdCreditDef: JcdCreditDef;
  jcd_project_id: number;
  sort_order: number;
}): Promise<JcdProdCreditDtoType> {
  let jcdProdCreditDto = await getJcdProdCredit(client, {
    jcd_project_id: opts.jcd_project_id,
    label: opts.jcdCreditDef.label,
  });
  if(jcdProdCreditDto !== undefined) {
    return jcdProdCreditDto;
  }
  jcdProdCreditDto = await insertJcdProdCredit(client, {
    jcd_project_id: opts.jcd_project_id,
    label: opts.jcdCreditDef.label,
    sort_order: opts.sort_order,
  });
  return jcdProdCreditDto;
}

async function insertJcdProdCredit(client: DbClient, opts: {
  jcd_project_id: number;
  label: string;
  sort_order: number;
}): Promise<JcdProdCreditDtoType> {
  await shiftJcdProdCreditSorts(client, {
    jcd_project_id: opts.jcd_project_id,
    sort_order: opts.sort_order,
  });
  let colNames = [
    'jcd_project_id',
    'label',
    'sort_order',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_prod_credit (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.label,
    opts.sort_order,
  ]);
  let jcdProdCreditDto = JcdProdCreditDto.deserialize(res.rows[0]);
  return jcdProdCreditDto;
}

async function getJcdProdCredit(client: DbClient, opts: {
  jcd_project_id: number;
  label: string;
}): Promise<JcdProdCreditDtoType | undefined> {
  let queryStr = `
    SELECT * FROM jcd_prod_credit jpc
      WHERE jpc.jcd_project_id = $1
      AND jpc.label LIKE $2
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.label
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let jcdProdCreditDto = JcdProdCreditDto.deserialize(res.rows[0]);
  return jcdProdCreditDto;
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
    SELECT * FROM jcd_prod_credit jpc
    WHERE jpc.jcd_project_id = $1
      AND jpc.sort_order >= $2
    FOR UPDATE
  `;
  await client.query(queryStr, [
    opts.jcd_project_id,
    opts.sort_order,
  ]);
  queryStr = `
    UPDATE jcd_prod_credit
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

async function upsertJcdProdCreditContrib(client: DbClient, opts: {
  jcdProdCreditDto: JcdProdCreditDtoType;
  jcdContribDto: PersonDtoType | OrgDtoType;
  sort_order: number;
}): Promise<JcdProdCreditContribDtoType> {
  let jcdProdCreditContribDto = await getJcdProdCreditContrib(client, {
    jcd_prod_credit_id: opts.jcdProdCreditDto.jcd_prod_credit_id,
    jcdContribDto: opts.jcdContribDto,
  });
  if(jcdProdCreditContribDto !== undefined) {
    return jcdProdCreditContribDto;
  }
  jcdProdCreditContribDto = await insertJcdProdCreditContrib(client, {
    jcd_prod_credit_id: opts.jcdProdCreditDto.jcd_prod_credit_id,
    jcdContribDto: opts.jcdContribDto,
    sort_order: opts.sort_order,
  });
  return jcdProdCreditContribDto;
}

async function insertJcdProdCreditContrib(client: DbClient, opts: {
  jcd_prod_credit_id: number;
  jcdContribDto: PersonDtoType | OrgDtoType;
  sort_order: number;
}): Promise<JcdProdCreditContribDtoType> {
  let jcdProdCreditContribDto: JcdProdCreditContribDtoType;
  if(PersonDto.check(opts.jcdContribDto)) {
    jcdProdCreditContribDto = await insertJcdProdCreditPersonContrib(client, {
      jcd_prod_credit_id: opts.jcd_prod_credit_id,
      jcdContribDto: opts.jcdContribDto,
      sort_order: opts.sort_order,
    });
  } else if(OrgDto.check(opts.jcdContribDto)) {
    jcdProdCreditContribDto = await insertJcdProdCreditOrgContrib(client, {
      jcd_prod_credit_id: opts.jcd_prod_credit_id,
      jcdContribDto: opts.jcdContribDto,
      sort_order: opts.sort_order,
    });
  } else {
    console.error({ jcdContribDto: opts.jcdContribDto });
    throw new Error('Invalid jcd_prod_credit_contrib DTO');
  }
  return jcdProdCreditContribDto;
}

async function insertJcdProdCreditPersonContrib(client: DbClient, opts: {
  jcd_prod_credit_id: number;
  jcdContribDto: PersonDtoType;
  sort_order: number;
}): Promise<JcdProdCreditContribDtoType> {
  await shiftJcdProdCreditContribSorts(client, {
    jcd_prod_credit_id: opts.jcd_prod_credit_id,
    sort_order: opts.sort_order,
  });
  let colNames = [
    'jcd_prod_credit_id',
    'person_id',
    'sort_order',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_prod_credit_contrib (${colNames.join(', ')})
      values(${colNums})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.jcd_prod_credit_id,
    opts.jcdContribDto.person_id,
    opts.sort_order,
  ]);
  let jcdProdCreditContribDto = JcdProdCreditContribDto.deserialize(res.rows[0]);
  return jcdProdCreditContribDto;
}

async function insertJcdProdCreditOrgContrib(client: DbClient, opts: {
  jcd_prod_credit_id: number;
  jcdContribDto: OrgDtoType;
  sort_order: number;
}): Promise<JcdProdCreditContribDtoType> {
  await shiftJcdProdCreditContribSorts(client, {
    jcd_prod_credit_id: opts.jcd_prod_credit_id,
    sort_order: opts.sort_order,
  });
  let colNames = [
    'jcd_prod_credit_id',
    'org_id',
    'sort_order',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_prod_credit_contrib (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.jcd_prod_credit_id,
    opts.jcdContribDto.org_id,
    opts.sort_order,
  ]);
  let jcdProdCreditContribDto = JcdProdCreditContribDto.deserialize(res.rows[0]);
  return jcdProdCreditContribDto;
}

async function shiftJcdProdCreditContribSorts(client: DbClient, opts: {
  jcd_prod_credit_id: number;
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
    SELECT * FROM jcd_prod_credit_contrib jpcc
      WHERE jpcc.jcd_prod_credit_id = $1
        AND jpcc.sort_order >= $2
    FOR UPDATE
  `;
  await client.query(queryStr, [
    opts.jcd_prod_credit_id,
    opts.sort_order,
  ]);
  queryStr = `
    UPDATE jcd_prod_credit_contrib
      SET sort_order = sort_order + $1
      WHERE jcd_prod_credit_id = $2
        AND sort_order >= $3
    returning *
  `;
  res = await client.query(queryStr, [
    shiftBy,
    opts.jcd_prod_credit_id,
    opts.sort_order,
  ]);
  return res;
}

async function getJcdProdCreditContrib(client: DbClient, opts: {
  jcd_prod_credit_id: number;
  jcdContribDto: PersonDtoType | OrgDtoType;
}): Promise<JcdProdCreditContribDtoType | undefined> {
  let jcdProdCreditContribDto: JcdProdCreditContribDtoType | undefined;
  if(PersonDto.check(opts.jcdContribDto)) {
    jcdProdCreditContribDto = await getJcdProdCreditPersonContrib(client, {
      jcd_prod_credit_id: opts.jcd_prod_credit_id,
      jcdContribDto: opts.jcdContribDto,
    });
  } else if(OrgDto.check(opts.jcdContribDto)) {
    jcdProdCreditContribDto = await getJcdProdCreditOrgContrib(client, {
      jcd_prod_credit_id: opts.jcd_prod_credit_id,
      jcdContribDto: opts.jcdContribDto,
    });
  } else {
    console.error({ jcdContribDto: opts.jcdContribDto });
    throw new Error('Invalid jcd_prod_credit_contrib DTO');
  }
  return jcdProdCreditContribDto;
}

async function getJcdProdCreditPersonContrib(client: DbClient, opts: {
  jcd_prod_credit_id: number;
  jcdContribDto: PersonDtoType;
}): Promise<JcdProdCreditContribDtoType | undefined> {
  let queryStr = `
    SELECT jpcc.* FROM jcd_prod_credit_contrib jpcc
      INNER JOIN jcd_prod_credit jpc
        ON jpc.jcd_prod_credit_id = jpcc.jcd_prod_credit_id
      INNER JOIN person p
        ON p.person_id = jpcc.person_id
    WHERE jpcc.jcd_prod_credit_id = $1
      AND p.person_id = $2
    ORDER BY jpcc.last_modified DESC
  `;
  let res = await client.query(queryStr, [
    opts.jcd_prod_credit_id,
    opts.jcdContribDto.person_id,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let jcdProdCreditContribDto = JcdProdCreditContribDto.deserialize(res.rows[0]);
  return jcdProdCreditContribDto;
}

async function getJcdProdCreditOrgContrib(client: DbClient, opts: {
  jcd_prod_credit_id: number;
  jcdContribDto: OrgDtoType;
}): Promise<JcdProdCreditContribDtoType | undefined> {
  let queryStr = `
    SELECT jpcc.* FROM jcd_prod_credit_contrib jpcc
      INNER JOIN jcd_prod_credit jpc
        ON jpc.jcd_prod_credit_id = jpcc.jcd_prod_credit_id
      INNER JOIN org o
        ON o.org_id = jpcc.org_id
    WHERE jpcc.jcd_prod_credit_id = $1
      AND o.org_id = $2
    ORDER BY jpcc.last_modified DESC
  `;
  let res = await client.query(queryStr, [
    opts.jcd_prod_credit_id,
    opts.jcdContribDto.org_id,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let jcdProdCreditContribDto = JcdProdCreditContribDto.deserialize(res.rows[0]);
  return jcdProdCreditContribDto;
}
