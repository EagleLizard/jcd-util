
import { JcdProjectVenueDto, JcdProjectVenueDtoType } from '../jcd-dto/jcd-project-venue-dto';
import { VenueDto, VenueDtoType } from '../jcd-dto/venue-dto';
import { DbClient } from '../../lib/postgres-client';

export const Venue = {
  getByName: getVenueByName,
  insert: insertVenue,
} as const;

export const JcdProjectVenue = {
  get: getJcdProjectVenue,
  insert: insertJcdProjectVenue,
} as const;

async function getVenueByName(client: DbClient, opts: {
  name: string;
}): Promise<VenueDtoType | undefined> {
  let queryStr = `
    SELECT * FROM venue v
      WHERE v.name LIKE $1
  `;
  let res = await client.query(queryStr, [
    opts.name,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let venueDto = VenueDto.deserialize(res.rows[0]);
  return venueDto;
}

async function insertVenue(client: DbClient, opts: {
  name: string;
}): Promise<VenueDtoType> {
  let queryStr = `
    INSERT INTO venue (name)
      values($1)
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.name,
  ]);
  let venueDto = VenueDto.deserialize(res.rows[0]);
  return venueDto;
}

async function getJcdProjectVenue(client: DbClient, opts: {
  jcd_project_id: number;
  venue_id: number;
}): Promise<JcdProjectVenueDtoType | undefined> {
  let queryStr = `
    SELECT jpv.* from jcd_project_venue jpv
      INNER JOIN jcd_project jp
        ON jpv.jcd_project_id = jp.jcd_project_id
      INNER JOIN venue v
        ON jpv.venue_id = v.venue_id
    WHERE jpv.jcd_project_id = $1
      AND jpv.venue_id = $2
    ORDER BY jpv.last_modified DESC
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.venue_id,
  ]);
  if(res.rows.length < 1) {
    return;
  }
  let jcdProjectVenueDto = JcdProjectVenueDto.deserialize(res.rows[0]);
  return jcdProjectVenueDto;
}

async function insertJcdProjectVenue(client: DbClient, opts: {
  jcd_project_id: number;
  venue_id: number;
}): Promise<JcdProjectVenueDtoType> {
  let colNames = [
    'jcd_project_id',
    'venue_id',
  ];
  let colNums = colNames.map((_, idx) => `$${idx + 1}`);
  let queryStr = `
    INSERT INTO jcd_project_venue (${colNames.join(', ')})
      values(${colNums.join(', ')})
    returning *
  `;
  let res = await client.query(queryStr, [
    opts.jcd_project_id,
    opts.venue_id,
  ]);
  let jcdProjectVenueDto = JcdProjectVenueDto.deserialize(res.rows[0]);
  return jcdProjectVenueDto;
}
