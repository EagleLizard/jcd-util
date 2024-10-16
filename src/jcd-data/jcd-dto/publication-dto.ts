
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  publication_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

const PublicationDtoSchema = Type.Object({
  publication_id: Type.Number(),
  name: Type.String(),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type PublicationDtoType = Static<typeof PublicationDtoSchema>;

export const PublicationDto = {
  deserialize,
} as const;

function deserialize(val: unknown): PublicationDtoType {
  return Value.Parse(PublicationDtoSchema, val);
}
