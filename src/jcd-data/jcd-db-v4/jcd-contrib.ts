import { PoolClient } from 'pg';
import { PersonDto, PersonDtoType } from '../jcd-dto/person-dto';
import { OrgDto, OrgDtoType } from '../jcd-dto/org-dto';

// type JcdContrib<T extends (PersonDtoType | OrgDtoType)> = {
//   getByName: (client: PoolClient, name: string) => Promise<T | undefined>
// };

export type JcdContribType = PersonDtoType | OrgDtoType;

export const Person = {
  getByName: getPersonByName,
  insert: insertPerson,
} as const;

export const Org = {
  getByName: getOrgByName,
  insert: insertOrg,
} as const;

async function getPersonByName(
  client: PoolClient,
  name: string,
): Promise<PersonDtoType | undefined> {
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

async function getOrgByName(
  client: PoolClient,
  name: string,
): Promise<OrgDtoType | undefined> {
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
