
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  jcd_producer_id SERIAL PRIMARY KEY,

  sort_order INT NOT NULL,
  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  person_id INT references person(person_id),
  org_id INT references org(org_id),
  UNIQUE(sort_order, jcd_project_id),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

const JcdProducerDtoSchema = Type.Object({
  jcd_producer_id: Type.Number(),
  jcd_project_id: Type.Number(),
  sort_order: Type.Number(),
  person_id: Type.Union([
    Type.Number(),
    Type.Null(),
  ]),
  org_id: Type.Union([
    Type.Number(),
    Type.Null(),
  ]),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type JcdProducerDtoType = Static<typeof JcdProducerDtoSchema>;

export const JcdProducerDto = {
  deserialize,
} as const;

function deserialize(val: unknown): JcdProducerDtoType {
  return Value.Parse(JcdProducerDtoSchema, val);
}
