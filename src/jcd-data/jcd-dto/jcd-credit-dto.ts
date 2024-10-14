
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  jcd_credit_id SERIAL PRIMARY KEY,

  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  person_contrib_id INT references person(person_id),
  org_contrib_id INT references org(org_id),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

const JcdCreditDtoSchema = Type.Object({
  jcd_credit_id: Type.Number(),
  jcd_project_id: Type.Number(),
  person_contrib_id: Type.Number(),
  org_contrib_id: Type.Number(),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type JcdCreditDtoType = Static<typeof JcdCreditDtoSchema>;

export const jcdCreditDto = {
  deserialize,
} as const;

function deserialize(val: unknown): JcdCreditDtoType {
  return Value.Parse(JcdCreditDtoSchema, val);
}
