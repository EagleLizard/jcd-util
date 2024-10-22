
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  jcd_project_id SERIAL PRIMARY KEY,
  project_key TEXT NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  route TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  project_date TIMESTAMP NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
*/

const JcdProjectDtoSchema = Type.Object({
  jcd_project_id: Type.Number(),
  project_key: Type.String(),
  active: Type.Boolean(),
  route: Type.String(),
  title: Type.String(),
  project_date: Type.Date(),

  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type JcdProjectDtoType = Static<typeof JcdProjectDtoSchema>;

const JcdProjectDto = {
  deserialize,
  schema: JcdProjectDtoSchema,
} as const;

export {
  JcdProjectDto,
};

function deserialize(val: unknown): JcdProjectDtoType {
  return Value.Parse(JcdProjectDtoSchema, val);
}
