
import { JcdCreditDto, JcdCreditDtoType, JcdCreditOrderDto } from '../jcd-dto/jcd-credit-dto';
import { PersonDto, PersonDtoType } from '../jcd-dto/person-dto';
import { OrgDto, OrgDtoType } from '../jcd-dto/org-dto';
import { JcdCreditContribDto, JcdCreditContribDtoType } from '../jcd-dto/jcd-credit-contrib-dto';
import { DbClient } from '../../lib/postgres-client';
import { QueryResult } from 'pg';

export const JcdCredit = {
  getAllByProject: getAllCreditsByProject,
  get: getJcdCredit,
  insert: insertJcdCredit,
} as const;

export const JcdCreditContrib = {
  get: getJcdCreditContrib,
  insert: insertJcdCreditContrib,
} as const;

async function getAllCreditsByProject(client: DbClient, opts: {
  jcd_project_id: number;
}) {
  let queryStr = `
    SELECT jc.*, jcs.sort_order FROM jcd_credit jc
      INNER JOIN jcd_project jp
        ON jc.jcd_project_id = jp.jcd_project_id
      INNER JOIN jcd_credit_sort jcs
        ON jc.jcd_credit_id = jcs.jcd_credit_id
    WHERE jc.jcd_project_id = $1
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
  ]);
  let jcdCreditOrderDtos = res.rows.map(JcdCreditOrderDto.deserialize);
  return jcdCreditOrderDtos;
}

async function getJcdCredit(client: DbClient, opts: {
  label: string;
  jcd_project_id: number;
}): Promise<JcdCreditDtoType | undefined> {
  let queryStr = `
    SELECT * FROM jcd_credit jc
      WHERE jc.jcd_project_id = $1
      AND jc.label LIKE $2
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.label,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let jcdCreditDto = JcdCreditDto.deserialize(res.rows[0]);
  return jcdCreditDto;
}

async function insertJcdCredit(client: DbClient, opts: {
  label: string;
  jcd_project_id: number;
}): Promise<JcdCreditDtoType> {
  let colNames = [
    'label',
    'jcd_project_id',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_credit (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.label,
    opts.jcd_project_id,
  ]);
  let jcdCreditDto = JcdCreditDto.deserialize(res.rows[0]);
  return jcdCreditDto;
}

/*
  ~~~~~~~~~~~~~~~~~~~~~~~~
  ~~ JCD CREDIT CONTRIB ~~
  ~~~~~~~~~~~~~~~~~~~~~~~~
*/

async function getJcdCreditContrib(client: DbClient, opts: {
  jcd_credit_id: number;
  jcdContribDto: PersonDtoType | OrgDtoType
}): Promise<JcdCreditContribDtoType | undefined> {
  let jcdCreditContribDto: JcdCreditContribDtoType | undefined;
  if(PersonDto.check(opts.jcdContribDto)) {
    jcdCreditContribDto = await getJcdCreditPersonContrib(client, {
      jcd_credit_id: opts.jcd_credit_id,
      jcdContribDto: opts.jcdContribDto,
    });
  } else if(OrgDto.check(opts.jcdContribDto)) {
    jcdCreditContribDto = await getJcdCreditOrgContrib(client, {
      jcd_credit_id: opts.jcd_credit_id,
      jcdContribDto: opts.jcdContribDto,
    });
  } else {
    console.error({ jcdContribDto: opts.jcdContribDto });
    throw new Error('Invalid jcd_credit_contrib DTO');
  }
  return jcdCreditContribDto;
}

async function getJcdCreditPersonContrib(client: DbClient, opts: {
  jcd_credit_id: number;
  jcdContribDto: PersonDtoType;
}): Promise<JcdCreditContribDtoType | undefined> {
  let queryStr = `
    SELECT jcc.* FROM jcd_credit_contrib jcc
      INNER JOIN jcd_credit jc ON jc.jcd_credit_id = jcc.jcd_credit_id
      INNER JOIN person p ON p.person_id = jcc.person_id
    WHERE jc.jcd_credit_id = $1
      AND p.person_id = $2
    ORDER BY jcc.last_modified DESC
  `;
  let res = await client.query(queryStr, [
    opts.jcd_credit_id,
    opts.jcdContribDto.person_id,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let jcdCreditContribDto = JcdCreditContribDto.deserialize(res.rows[0]);
  return jcdCreditContribDto;
}

async function getJcdCreditOrgContrib(client: DbClient, opts: {
  jcd_credit_id: number;
  jcdContribDto: OrgDtoType;
}): Promise<JcdCreditContribDtoType | undefined> {
  let queryStr = `
    SELECT jcc.* from jcd_credit_contrib jcc
      INNER JOIN jcd_credit jc ON jc.jcd_credit_id = jcc.jcd_credit_id
      INNER JOIN org o ON o.org_id = jcc.org_id
    WHERE jc.jcd_credit_id = $1
      AND o.org_id = $2
    ORDER BY jcc.last_modified DESC
  `;
  let res = await client.query(queryStr, [
    opts.jcd_credit_id,
    opts.jcdContribDto.org_id,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let jcdCreditContribDto = JcdCreditContribDto.deserialize(res.rows[0]);
  return jcdCreditContribDto;
}

async function insertJcdCreditContrib(client: DbClient, opts: {
  jcd_credit_id: number;
  jcdContribDto: PersonDtoType | OrgDtoType;
  sort_order: number;
}): Promise<JcdCreditContribDtoType> {
  let jcdCreditContribDto: JcdCreditContribDtoType;
  if(PersonDto.check(opts.jcdContribDto)) {
    jcdCreditContribDto = await insertJcdCreditPersonContrib(client, {
      jcd_credit_id: opts.jcd_credit_id,
      jcdContribDto: opts.jcdContribDto,
      sort_order: opts.sort_order,
    });
  } else if(OrgDto.check(opts.jcdContribDto)) {
    jcdCreditContribDto = await insertJcdCreditOrgContrib(client, {
      jcd_credit_id: opts.jcd_credit_id,
      jcdContribDto: opts.jcdContribDto,
      sort_order: opts.sort_order,
    });
  } else {
    console.error({ jcdContribDto: opts.jcdContribDto });
    throw new Error('Invalid jcd_credit_contrib DTO');
  }
  return jcdCreditContribDto;
}

async function insertJcdCreditPersonContrib(client: DbClient, opts: {
  jcd_credit_id: number;
  jcdContribDto: PersonDtoType;
  sort_order: number;
}): Promise<JcdCreditContribDtoType> {
  await shiftJcdCreditContribSorts(client, {
    jcd_credit_id: opts.jcd_credit_id,
    sort_order: opts.sort_order,
  });
  let colNames = [
    'jcd_credit_id',
    'person_id',
    'sort_order',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_credit_contrib (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.jcd_credit_id,
    opts.jcdContribDto.person_id,
    opts.sort_order,
  ]);
  let jcdCreditContribDto = JcdCreditContribDto.deserialize(res.rows[0]);
  return jcdCreditContribDto;
}

async function insertJcdCreditOrgContrib(client: DbClient, opts: {
  jcd_credit_id: number;
  jcdContribDto: OrgDtoType;
  sort_order: number;
}): Promise<JcdCreditContribDtoType> {
  await shiftJcdCreditContribSorts(client, {
    jcd_credit_id: opts.jcd_credit_id,
    sort_order: opts.sort_order,
  });
  let colNames = [
    'jcd_credit_id',
    'org_id',
    'sort_order',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_credit_contrib (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.jcd_credit_id,
    opts.jcdContribDto.org_id,
    opts.sort_order,
  ]);
  let jcdCreditContribDto = JcdCreditContribDto.deserialize(res.rows[0]);
  return jcdCreditContribDto;
}

async function shiftJcdCreditContribSorts(client: DbClient, opts: {
  jcd_credit_id: number;
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
    SELECT * FROM jcd_credit_contrib jcc
      WHERE jcc.jcd_credit_id = $1
        AND jcc.sort_order >= $2
    FOR UPDATE
  `;
  await client.query(queryStr, [
    opts.jcd_credit_id,
    opts.sort_order,
  ]);
  queryStr = `
    UPDATE jcd_credit_contrib
      SET sort_order = sort_order + $1
      WHERE jcd_credit_id = $2
        AND sort_order >= $3
    returning *
  `;
  res = await client.query(queryStr, [
    opts.shiftBy,
    opts.jcd_credit_id,
    opts.sort_order,
  ]);
  return res;
}
