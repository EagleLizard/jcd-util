
import { JcdProducerDto, JcdProducerDtoType } from '../jcd-dto/jcd-producer-dto';
import { PersonDto, PersonDtoType } from '../jcd-dto/person-dto';
import { OrgDto, OrgDtoType } from '../jcd-dto/org-dto';
import { DbClient } from '../../lib/postgres-client';

export const JcdProducer = {
  get: getJcdProducer,
  insert: insertJcdProducer,
} as const;

function insertJcdProducer(client: DbClient, opts: {
  jcd_project_id: number;
  jcdContribDto: PersonDtoType | OrgDtoType;
}): Promise<JcdProducerDtoType> {
  if(PersonDto.check(opts.jcdContribDto)) {
    return insertJcdPersonProducer(client, {
      jcd_project_id: opts.jcd_project_id,
      jcdContribDto: opts.jcdContribDto,
    });
  }
  if(OrgDto.check(opts.jcdContribDto)) {
    return insertJcdOrgProducer(client, {
      jcd_project_id: opts.jcd_project_id,
      jcdContribDto: opts.jcdContribDto,
    });
  }
  console.error({
    jcd_project_id: opts.jcd_project_id,
    jcdContribDto: opts.jcdContribDto,
  });
  throw new Error('Invalid insert into jcd_producer');
}

async function insertJcdPersonProducer(client: DbClient, opts: {
  jcd_project_id: number;
  jcdContribDto: PersonDtoType;
}): Promise<JcdProducerDtoType> {
  let colNames = [
    'jcd_project_id',
    'person_id',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_producer (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.jcdContribDto,
  ]);
  let jcdProducerDto = JcdProducerDto.deserialize(res.rows[0]);
  return jcdProducerDto;
}

async function insertJcdOrgProducer(client: DbClient, opts: {
  jcd_project_id: number;
  jcdContribDto: OrgDtoType;
}): Promise<JcdProducerDtoType> {
  let colNames = [
    'jcd_project_id',
    'org_id',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_producer (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.jcdContribDto.org_id,
  ]);
  let jcdProducerDto = JcdProducerDto.deserialize(res.rows[0]);
  return jcdProducerDto;
}

async function getJcdProducer(client: DbClient, opts: {
  jcd_project_id: number;
  jcdContribDto: PersonDtoType | OrgDtoType;
}): Promise<JcdProducerDtoType | undefined> {
  let jcdProducerDto: JcdProducerDtoType | undefined;

  if(PersonDto.check(opts.jcdContribDto)) {
    jcdProducerDto = await getJcdPersonProducer(client, {
      jcd_project_id: opts.jcd_project_id,
      jcdCondtribDto: opts.jcdContribDto,
    });
  } else if(OrgDto.check(opts.jcdContribDto)) {
    jcdProducerDto = await getJcdOrgProducer(client, {
      jcd_project_id: opts.jcd_project_id,
      jcdCondtribDto: opts.jcdContribDto,
    });
  } else {
    console.error({ jcdContribDto: opts.jcdContribDto });
    throw new Error('Invalid jcd_producer contrib DTO');
  }

  return jcdProducerDto;
}

async function getJcdPersonProducer(client: DbClient, opts: {
  jcd_project_id: number;
  jcdCondtribDto: PersonDtoType;
}): Promise<JcdProducerDtoType | undefined> {
  let queryStr = `
    SELECT * FROM jcd_producer jpr
      INNER JOIN jcd_project jp
        ON jpr.jcd_project_id = jp.jcd_project_id
      INNER JOIN person p
        ON p.person_id = jpr.person_id
    WHERE jp.jcd_project_id = $1
      AND p.person_id = $2
    ORDER BY jpr.last_modified DESC
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.jcdCondtribDto.person_id,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let jcdProducerDto = JcdProducerDto.deserialize(res.rows[0]);
  return jcdProducerDto;
}

async function getJcdOrgProducer(client: DbClient, opts: {
  jcd_project_id: number;
  jcdCondtribDto: OrgDtoType;
}): Promise<JcdProducerDtoType | undefined> {
  let queryStr = `
    SELECT * FROM jcd_producer jpr
      INNER JOIN jcd_project jp
        ON jpr.jcd_project_id = jp.jcd_project_id
      INNER JOIN org o
        ON o.org_id = jpr.org_id
    WHERE jp.jcd_project_id = $1
      AND o.org_id = $2
    ORDER BY jpr.last_modified DESC
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.jcdCondtribDto.org_id,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let jcdProducerDto = JcdProducerDto.deserialize(res.rows[0]);
  return jcdProducerDto;
}
