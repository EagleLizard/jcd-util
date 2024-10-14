
import { type PoolClient } from 'pg';
import { PostgresClient } from '../../lib/postgres-client';
import { JcdProjectDto, JcdProjectDtoType } from '../jcd-dto/jcd-project-dto';
import { JcdContribDef, JcdCreditDef, JcdProjectDef, JcdV4Projects } from './jcd-v4-projects';
import { DescriptionDto } from '../jcd-dto/description-dto';
import { JcdProjectDescDto } from '../jcd-dto/jcd-project-desc-dto';
import { JcdCreditDto, JcdCreditDtoType } from '../jcd-dto/jcd-credit-dto';
import { PersonDtoType, PersonDto } from '../jcd-dto/person-dto';
import { OrgDtoType, OrgDto } from '../jcd-dto/org-dto';

export async function jcdDbV4Main() {

  // let projects = JcdV4Projects;
  let projects = JcdV4Projects.slice(0, 5);
  console.log(projects.map(proj => proj.project_key));
  for(let i = 0; i < projects.length; ++i) {
    let currProject = projects[i];
    await upsertProjectDef(currProject);
  }
  await PostgresClient.end();
}

async function upsertProjectDef(jcdProjectDef: JcdProjectDef) {
  console.log(jcdProjectDef.project_key);
  await PostgresClient.transact(async (pgClient) => {
    let jcdProjectDto = await upsertProject(pgClient, jcdProjectDef);

    let descDto = await upsertProjectDesc(pgClient, {
      text: jcdProjectDef.description.join('\n'),
      jcd_project_id: jcdProjectDto.jcd_project_id,
    });

    let jcdProjDescDto = await upsertJcdProjectDesc(pgClient, {
      jcd_project_id: jcdProjectDto.jcd_project_id,
      description_id: descDto.description_id,
    });

    console.log(jcdProjectDto.jcd_project_id);
    console.log(jcdProjDescDto.jcd_project_description_id);

    let jcdProjectCredits = await upsertJcdCredits(pgClient, {
      jcdProjectDef,
      jcd_project_id: jcdProjectDto.jcd_project_id,
    });
    console.log(jcdProjectCredits);
  });
}

async function upsertJcdCredits(client: PoolClient, opts: {
  jcdProjectDef: JcdProjectDef,
  jcd_project_id: number,
}): Promise<JcdCreditDtoType[]> {
  let jcdCredits: JcdCreditDtoType[] = [];
  for(let i = 0; i < opts.jcdProjectDef.credits.length; ++i) {
    let currCredit = opts.jcdProjectDef.credits[i];
    let currCreditDto = await upsertJcdCredit(client, {
      creditDef: currCredit,
      jcd_project_id: opts.jcd_project_id,
    });
    jcdCredits.push(currCreditDto);
    let contribDtos: (PersonDtoType | OrgDtoType)[] = [];
    for(let k = 0; k < currCredit.contribs.length; ++k) {
      let currContrib = currCredit.contribs[k];
      let currContribDto = await upsertContrib(client, {
        contribDef: currContrib,
      });
      contribDtos.push(currContribDto);
    }
    console.log(currCreditDto);
    console.log(contribDtos);
  }
  return jcdCredits;
}

async function upsertJcdCredit(client: PoolClient, opts: {
  creditDef: JcdCreditDef,
  jcd_project_id: number,
}): Promise<JcdCreditDtoType> {
  // console.log(opts.creditDef);
  /*
    first, upsert the credit_contrib
   */
  let jcdCreditDto = await getJcdCredit(client, {
    text: opts.creditDef.label,
    jcd_project_id: opts.jcd_project_id,
  });
  if(jcdCreditDto !== undefined) {
    return jcdCreditDto;
  }
  jcdCreditDto = await insertJcdCredit(client, {
    text: opts.creditDef.label,
    jcd_project_id: opts.jcd_project_id,
  });
  return jcdCreditDto;
}

async function insertJcdCredit(client: PoolClient, opts: {
  text: string;
  jcd_project_id: number;
}): Promise<JcdCreditDtoType> {
  let colNames = [
    'text',
    'jcd_project_id',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_credit (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.text,
    opts.jcd_project_id,
  ]);
  let jcdCreditDto = JcdCreditDto.deserialize(res.rows[0]);
  return jcdCreditDto;
}

async function getJcdCredit(client: PoolClient, opts: {
  text: string;
  jcd_project_id: number;
}): Promise<JcdCreditDtoType | undefined> {
  let queryStr = `
    SELECT * FROM jcd_credit jc
      WHERE jc.jcd_project_id = $1
      AND jc.text LIKE $2
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.text,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let jcdCreditDto = JcdCreditDto.deserialize(res.rows[0]);
  return jcdCreditDto;
}

async function upsertContrib(client: PoolClient, opts: {
  contribDef: JcdContribDef,
}): Promise<PersonDtoType | OrgDtoType> {
  let contribDto: PersonDtoType | OrgDtoType;
  console.log(opts.contribDef);
  switch(opts.contribDef[0]) {
    case 'p':
      contribDto = await upsertPerson(client, {
        name: opts.contribDef[1],
      });
      break;
    case 'o':
      contribDto = await upsertOrg(client, {
        name: opts.contribDef[1],
      });
      break;
    default:
      throw new Error(`Unsupported contrib type: ${opts.contribDef[0]}`);
  }
  return contribDto;
}

async function upsertPerson(client: PoolClient, opts: {
  name: string,
}): Promise<PersonDtoType> {
  let personDto = await getPersonByName(client, opts.name);
  if(personDto !== undefined) {
    return personDto;
  }
  personDto = await insertPerson(client, opts);
  return personDto;
}

async function insertPerson(client: PoolClient, opts: {
  name: string;
}): Promise<PersonDtoType> {
  let queryStr = `
    INSERT INTO person (name)
      values($1)
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.name,
  ]);
  let personDto = PersonDto.deserialize(res.rows[0]);
  return personDto;
}

async function getPersonByName(client: PoolClient, name: string): Promise<PersonDtoType | undefined> {
  let queryStr = `
    SELECT * FROM person p
      WHERE p.name LIKE $1
  `;
  let res = await client.query(queryStr, [
    name,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  return PersonDto.deserialize(res.rows[0]);
}

async function upsertOrg(client: PoolClient, opts: {
  name: string;
}): Promise<OrgDtoType> {
  let orgDto = await getOrgByName(client, opts.name);
  if(orgDto !== undefined) {
    return orgDto;
  }
  orgDto = await insertOrg(client, opts);
  return orgDto;
}

async function insertOrg(client: PoolClient, opts: {
  name: string;
}): Promise<OrgDtoType> {
  let queryStr = `
    INSERT INTO org (name)
      values($1)
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.name,
  ]);
  let orgDto = OrgDto.deserialize(res.rows[0]);
  return orgDto;
}

async function getOrgByName(client: PoolClient, name: string): Promise<OrgDtoType | undefined> {
  let queryStr = `
    SELECT * FROM org o
      WHERE o.name LIKE $1
  `;
  let res = await client.query(queryStr, [
    name,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let orgDto = OrgDto.deserialize(res.rows[0]);
  return orgDto;
}

async function upsertJcdProjectDesc(client: PoolClient, opts: {
  jcd_project_id: number,
  description_id: number,
}): Promise<JcdProjectDescDto> {
  let jcdProjDescDto = await getJcdProjectDesc(client, {
    jcd_project_id: opts.jcd_project_id,
    description_id: opts.description_id,
  });
  if(jcdProjDescDto !== undefined) {
    return jcdProjDescDto;
  }
  let colNames = [
    'jcd_project_id',
    'description_id',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let insertQueryStr = `
    INSERT INTO jcd_project_description (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(insertQueryStr, [
    opts.jcd_project_id,
    opts.description_id,
  ]);
  jcdProjDescDto = JcdProjectDescDto.deserialize(res.rows[0]);
  return jcdProjDescDto;
}

async function getJcdProjectDesc(client: PoolClient, opts: {
  jcd_project_id: number,
  description_id: number,
}): Promise<JcdProjectDescDto | undefined> {
  let queryStr = `
    SELECT jpd.* from jcd_project_description jpd
      INNER JOIN jcd_project jp ON jpd.jcd_project_id = $1
      INNER JOIN description d ON jpd.description_id = $2
    ORDER BY jpd.last_modified DESC
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.description_id,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let jcdProjDescDto = JcdProjectDescDto.deserialize(res.rows[0]);
  return jcdProjDescDto;
}

async function upsertProjectDesc(client: PoolClient, opts: {
  text: string;
  jcd_project_id: number;
}): Promise<DescriptionDto> {
  let descDto = await getDescriptionByText(client, {
    text: opts.text,
    jcd_project_id: opts.jcd_project_id,
  });
  if(descDto !== undefined) {
    return descDto;
  }
  descDto = await insertDescription(client, {
    text: opts.text,
  });
  return descDto;
}

async function insertDescription(client: PoolClient, opts: {
  text: string,
}): Promise<DescriptionDto> {
  let queryStr = `
    INSERT INTO description (text)
      values($1)
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.text,
  ]);
  let descDto = DescriptionDto.deserialize(res.rows[0]);
  return descDto;
}

async function getDescriptionByText(client: PoolClient, opts: {
  text: string;
  jcd_project_id: number;
}): Promise<DescriptionDto | undefined> {
  let queryStr = `
    SELECT d.description_id, d.text, d.created_at, d.last_modified  FROM description d
      LEFT JOIN jcd_project_description jpd ON jpd.jcd_project_id = $1
      WHERE d.text LIKE $2
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.text,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let descDto = DescriptionDto.deserialize(res.rows[0]);
  return descDto;
}

async function upsertProject(client: PoolClient, jcdProjectDef: JcdProjectDef): Promise<JcdProjectDtoType> {
  let jcdProjectDto: JcdProjectDtoType | undefined;
  jcdProjectDto = await getProjectByKey(client, jcdProjectDef.project_key);
  if(jcdProjectDto !== undefined) {
    return jcdProjectDto;
  }
  jcdProjectDto = await insertProject(client, jcdProjectDef);
  return jcdProjectDto;
}

async function insertProject(client: PoolClient, jcdProjectDef: JcdProjectDef): Promise<JcdProjectDtoType> {
  let colNames = [
    'project_key',
    'route',
    'title',
    'project_date',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let rowVals = [
    jcdProjectDef.project_key,
    jcdProjectDef.route,
    jcdProjectDef.title,
    jcdProjectDef.project_date,
  ];
  let queryStr = `
    INSERT INTO jcd_project (${colNames.join(', ')})
      values (${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, rowVals);
  let jcdProjectDto = JcdProjectDto.deserialize(res.rows[0]);
  return jcdProjectDto;
}

async function getProjectByKey(client: PoolClient, projectKey: string) {
  let res = await client.query(`
    SELECT * FROM jcd_project jp
      WHERE jp.project_key = $1
  `, [ projectKey ]);
  if(res.rows.length < 1) {
    return undefined;
  }
  if(res.rows.length > 1) {
    throw new Error(`Expected one result for key '${projectKey}', found: ${res.rows.length}`);
  }
  let jcdProjectDto = JcdProjectDto.deserialize(res.rows[0]);
  return jcdProjectDto;
}
