
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  venue_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

const VenueDtoSchema = Type.Object({
  venue_id: Type.Number(),
  name: Type.String(),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type VenueDtoType = Static<typeof VenueDtoSchema>;

export const VenueDto = {
  deserialize,
} as const;

function deserialize(val: unknown): VenueDtoType {
  return Value.Parse(VenueDtoSchema, val);
}
