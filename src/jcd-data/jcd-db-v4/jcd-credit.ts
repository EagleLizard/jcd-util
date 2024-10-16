import { PoolClient } from 'pg';
import { JcdCreditDto, JcdCreditDtoType } from '../jcd-dto/jcd-credit-dto';
import { PersonDto, PersonDtoType } from '../jcd-dto/person-dto';
import { OrgDto, OrgDtoType } from '../jcd-dto/org-dto';
import { JcdCreditContribDto, JcdCreditContribDtoType } from '../jcd-dto/jcd-credit-contrib-dto';

export const JcdCredit = {
  get: getJcdCredit,
  insert: insertJcdCredit,
} as const;

export const JcdCreditContrib = {
  get: getJcdCreditContrib,
  insert: insertJcdCreditContrib,
} as const;

async function getJcdCredit(client: PoolClient, opts: {
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

async function insertJcdCredit(client: PoolClient, opts: {
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

async function getJcdCreditContrib(client: PoolClient, opts: {
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

async function getJcdCreditPersonContrib(client: PoolClient, opts: {
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

async function getJcdCreditOrgContrib(client: PoolClient, opts: {
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

async function insertJcdCreditContrib(client: PoolClient, opts: {
  jcd_credit_id: number;
  jcdContribDto: PersonDtoType | OrgDtoType;
}): Promise<JcdCreditContribDtoType> {
  let jcdCreditContribDto: JcdCreditContribDtoType;
  if(PersonDto.check(opts.jcdContribDto)) {
    jcdCreditContribDto = await insertJcdCreditPersonContrib(client, {
      jcd_credit_id: opts.jcd_credit_id,
      jcdContribDto: opts.jcdContribDto,
    });
  } else if(OrgDto.check(opts.jcdContribDto)) {
    jcdCreditContribDto = await insertJcdCreditOrgContrib(client, {
      jcd_credit_id: opts.jcd_credit_id,
      jcdContribDto: opts.jcdContribDto,
    });
  } else {
    console.error({ jcdContribDto: opts.jcdContribDto });
    throw new Error('Invalid jcd_credit_contrib DTO');
  }
  return jcdCreditContribDto;
}

async function insertJcdCreditPersonContrib(client: PoolClient, opts: {
  jcd_credit_id: number;
  jcdContribDto: PersonDtoType;
}): Promise<JcdCreditContribDtoType> {
  let colNames = [
    'jcd_credit_id',
    'person_id',
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
  ]);
  let jcdCreditContribDto = JcdCreditContribDto.deserialize(res.rows[0]);
  return jcdCreditContribDto;
}

async function insertJcdCreditOrgContrib(client: PoolClient, opts: {
  jcd_credit_id: number;
  jcdContribDto: OrgDtoType;
}): Promise<JcdCreditContribDtoType> {
  let colNames = [
    'jcd_credit_id',
    'org_id',
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
  ]);
  let jcdCreditContribDto = JcdCreditContribDto.deserialize(res.rows[0]);
  return jcdCreditContribDto;
}
