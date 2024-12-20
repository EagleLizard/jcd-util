
import { JcdProjectDef } from './jcd-v4-projects';
import { JcdProjectDto, JcdProjectDtoType } from '../jcd-dto/jcd-project-dto';
import { DbClient } from '../../lib/postgres-client';

export const JcdProject = {
  getAll: getJcdProjects,
  getByKey: getProjectByKey,
  insert: insertProject,
} as const;

async function getJcdProjects(client: DbClient) {
  let queryStr = `
    SELECT * FROM jcd_project jp
  `;
  let res = await client.query(queryStr);
  let jcdProjects = res.rows.map(JcdProjectDto.deserialize);
  return jcdProjects;
}

async function insertProject(
  client: DbClient,
  jcdProjectDef: JcdProjectDef
): Promise<JcdProjectDtoType> {
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

async function getProjectByKey(client: DbClient, projectKey: string) {
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
