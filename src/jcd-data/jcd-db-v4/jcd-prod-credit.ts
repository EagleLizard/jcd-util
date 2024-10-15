
import { type PoolClient } from 'pg';

import { JcdCreditDef } from './jcd-v4-projects';
import { JcdProdCreditDto, JcdProdCreditDtoType } from '../jcd-dto/jcd-prod-credit-dto';
import { PersonDto, PersonDtoType } from '../jcd-dto/person-dto';
import { OrgDto, OrgDtoType } from '../jcd-dto/org-dto';
import { JcdProdCreditContribDto, JcdProdCreditContribDtoType } from '../jcd-dto/jcd-prod-credit-contrib-dto';

export const JcdProdCredit = {
  upsert: upsertJcdProdCredit,
} as const;

export const JcdProdCreditContrib = {
  upsert: upsertJcdProdCreditContrib,
} as const;

async function upsertJcdProdCredit(client: PoolClient, opts: {
  jcdCreditDef: JcdCreditDef;
  jcd_project_id: number;
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
  });
  return jcdProdCreditDto;
}

async function insertJcdProdCredit(client: PoolClient, opts: {
  jcd_project_id: number;
  label: string;
}): Promise<JcdProdCreditDtoType> {
  let colNames = [
    'jcd_project_id',
    'label',
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
  ]);
  let jcdProdCreditDto = JcdProdCreditDto.deserialize(res.rows[0]);
  return jcdProdCreditDto;
}

async function getJcdProdCredit(client: PoolClient, opts: {
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

async function upsertJcdProdCreditContrib(client: PoolClient, opts: {
  jcdProdCreditDto: JcdProdCreditDtoType;
  jcdContribDto: PersonDtoType | OrgDtoType;
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
  });
  return jcdProdCreditContribDto;
}

async function insertJcdProdCreditContrib(client: PoolClient, opts: {
  jcd_prod_credit_id: number;
  jcdContribDto: PersonDtoType | OrgDtoType;
}): Promise<JcdProdCreditContribDtoType> {
  let jcdProdCreditContribDto: JcdProdCreditContribDtoType;
  if(PersonDto.check(opts.jcdContribDto)) {
    jcdProdCreditContribDto = await insertJcdProdCreditPersonContrib(client, {
      jcd_prod_credit_id: opts.jcd_prod_credit_id,
      jcdContribDto: opts.jcdContribDto,
    });
  } else if(OrgDto.check(opts.jcdContribDto)) {
    jcdProdCreditContribDto = await insertJcdProdCreditOrgContrib(client, {
      jcd_prod_credit_id: opts.jcd_prod_credit_id,
      jcdContribDto: opts.jcdContribDto,
    });
  } else {
    console.error({ jcdContribDto: opts.jcdContribDto });
    throw new Error('Invalid jcd_prod_credit_contrib DTO');
  }
  return jcdProdCreditContribDto;
}

async function insertJcdProdCreditPersonContrib(client: PoolClient, opts: {
  jcd_prod_credit_id: number;
  jcdContribDto: PersonDtoType;
}): Promise<JcdProdCreditContribDtoType> {
  let colNames = [
    'jcd_prod_credit_id',
    'person_id',
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
  ]);
  let jcdProdCreditContribDto = JcdProdCreditContribDto.deserialize(res.rows[0]);
  return jcdProdCreditContribDto;
}

async function insertJcdProdCreditOrgContrib(client: PoolClient, opts: {
  jcd_prod_credit_id: number;
  jcdContribDto: OrgDtoType;
}): Promise<JcdProdCreditContribDtoType> {
  let colNames = [
    'jcd_prod_credit_id',
    'org_id',
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
  ]);
  let jcdProdCreditContribDto = JcdProdCreditContribDto.deserialize(res.rows[0]);
  return jcdProdCreditContribDto;
}

async function getJcdProdCreditContrib(client: PoolClient, opts: {
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

async function getJcdProdCreditPersonContrib(client: PoolClient, opts: {
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

async function getJcdProdCreditOrgContrib(client: PoolClient, opts: {
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
