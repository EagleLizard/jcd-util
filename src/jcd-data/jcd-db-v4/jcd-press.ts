
import { PoolClient } from 'pg';
import { PublicationDto, PublicationDtoType } from '../jcd-dto/publication-dto';
import { JcdPressDto, JcdPressDtoType } from '../jcd-dto/jcd-press-dto';

export const JcdPress = {
  get: getJcdPress,
  insert: insertJcdPress,
} as const;

export const Publication = {
  getByName: getPublicationByName,
  insert: insertPublication,
} as const;

async function insertJcdPress(client: PoolClient, opts: {
  jcd_project_id: number;
  publication_id: number;
  link_text: string;
  link_url: string;
  description?: string;
}): Promise<JcdPressDtoType> {
  let colNames = [
    'jcd_project_id',
    'publication_id',
    'link_text',
    'link_url',
  ];
  let rowVals = [
    opts.jcd_project_id,
    opts.publication_id,
    opts.link_text,
    opts.link_url,
  ];
  if(opts.description !== undefined) {
    colNames.push('description');
    rowVals.push(opts.description);
  }
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);

  let queryStr = `
    INSERT INTO jcd_press (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, rowVals);
  let jcdPressDto = JcdPressDto.deserialize(res.rows[0]);
  return jcdPressDto;
}

async function getJcdPress(client: PoolClient, opts: {
  jcd_project_id: number;
  publication_id: number;
}): Promise<JcdPressDtoType | undefined> {
  let queryStr = `
    SELECT * FROM jcd_press jps
      INNER JOIN jcd_project jp
        ON jps.jcd_project_id = jp.jcd_project_id
      INNER JOIN publication p
        ON jps.publication_id = p.publication_id
    WHERE jps.jcd_project_id = $1
      AND jps.publication_id = $2
    ORDER BY jps.last_modified DESC
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.publication_id,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let jcdPressDto = JcdPressDto.deserialize(res.rows[0]);
  return jcdPressDto;
}

async function getPublicationByName(client: PoolClient, opts: {
  name: string;
}): Promise<PublicationDtoType | undefined> {
  let queryStr = `
    SELECT * FROM publication p
      WHERE p.name LIKE $1
  `;
  let res = await client.query(queryStr, [
    opts.name,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let publicationDto = PublicationDto.deserialize(res.rows[0]);
  return publicationDto;
}

async function insertPublication(client: PoolClient, opts: {
  name: string;
}): Promise<PublicationDtoType> {
  let queryStr = `
    INSERT INTO publication (name)
      values($1)
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.name,
  ]);
  let publicationDto = PublicationDto.deserialize(res.rows[0]);
  return publicationDto;
}
