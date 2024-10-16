
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  jcd_project_venue_id SERIAL PRIMARY KEY,

  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  venue_id INT references venue(venue_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

const JcdProjectVenueDtoSchema = Type.Object({
  jcd_project_venue_id: Type.Number(),
  jcd_project_id: Type.Number(),
  venue_id: Type.Number(),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type JcdProjectVenueDtoType = Static<typeof JcdProjectVenueDtoSchema>;

export const JcdProjectVenueDto = {
  deserialize,
} as const;

function deserialize(val: unknown): JcdProjectVenueDtoType {
  return Value.Parse(JcdProjectVenueDtoSchema, val);
}
