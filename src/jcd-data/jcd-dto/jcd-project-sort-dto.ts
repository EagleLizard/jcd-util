
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  jcd_project_sort_id SERIAL PRIMARY KEY,
  sort_order INT NOT NULL UNIQUE,

  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL UNIQUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

const JcdProjectSortDtoSchema = Type.Object({
  jcd_project_sort_id: Type.Number(),
  sort_order: Type.Number(),
  jcd_project_id: Type.Number(),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type JcdProjectSortDtoType = Static<typeof JcdProjectSortDtoSchema>;

export const JcdProjectSortDto = {
  deserialize,
} as const;

function deserialize(val: unknown): JcdProjectSortDtoType {
  return Value.Parse(JcdProjectSortDtoSchema, val);
}
