
import { JcdProjectDescDto } from '../jcd-dto/jcd-project-desc-dto';
import { DescriptionDto } from '../jcd-dto/description-dto';
import { DbClient } from '../../lib/postgres-client';

export const Description = {
  getByText: getDescriptionByText,
  insert: insertDescription,
} as const;

async function insertDescription(client: DbClient, opts: {
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

async function getDescriptionByText(client: DbClient, opts: {
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

export const JcdProjectDesc = {
  get: getJcdProjectDesc,
  insert: insertJcdProjectDesc,
} as const;

async function insertJcdProjectDesc(client: DbClient, opts: {
  jcd_project_id: number;
  description_id: number;
}): Promise<JcdProjectDescDto> {
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
  let jcdProjDescDto = JcdProjectDescDto.deserialize(res.rows[0]);
  return jcdProjDescDto;
}

async function getJcdProjectDesc(client: DbClient, opts: {
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
