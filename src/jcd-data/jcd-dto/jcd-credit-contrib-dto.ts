
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  jcd_credit_contrib_id SERIAL PRIMARY KEY,

  jcd_credit_id INT references jcd_credit(jcd_credit_id) NOT NULL,
  person_id INT references person(person_id),
  org_id INT references org(org_id),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

const JcdCreditContribDtoSchema = Type.Object({
  jcd_credit_contrib_id: Type.Number(),
  jcd_credit_id: Type.Number(),
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

export type JcdCreditContribDtoType = Static<typeof JcdCreditContribDtoSchema>;

export const JcdCreditContribDto = {
  deserialize,
} as const;

function deserialize(val: unknown): JcdCreditContribDtoType {
  return Value.Parse(JcdCreditContribDtoSchema, val);
}
