
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  jcd_prod_credit_contrib_id SERIAL PRIMARY KEY,

  jcd_prod_credit_id INT references jcd_prod_credit(jcd_prod_credit_id) NOT NULL,
  person_id INT references person(person_id),
  org_id INT references org(org_id),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

const JcdProdCreditContribDtoSchema = Type.Object({
  jcd_prod_credit_contrib_id: Type.Number(),
  jcd_prod_credit_id: Type.Number(),
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

export type JcdProdCreditContribDtoType = Static<typeof JcdProdCreditContribDtoSchema>;

export const JcdProdCreditContribDto = {
  deserialize,
} as const;

function deserialize(val: unknown): JcdProdCreditContribDtoType {
  return Value.Parse(JcdProdCreditContribDtoSchema, val);
}
