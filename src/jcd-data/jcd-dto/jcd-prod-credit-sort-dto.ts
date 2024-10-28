
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  jcd_prod_credit_sort_id SERIAL PRIMARY KEY,
  sort_order INT NOT NULL,

  jcd_prod_credit_id INT references jcd_prod_credit(jcd_prod_credit_id) NOT NULL UNIQUE,
  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  UNIQUE(jcd_prod_credit_id, jcd_project_id, sort_order),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
_*/

const JcdProdCreditSortDtoSchema = Type.Object({
  jcd_prod_credit_sort_id: Type.Number(),
  sort_order: Type.Number(),
  jcd_prod_credit_id: Type.Number(),
  jcd_project_id: Type.Number(),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type JcdProdCreditSortDtoType = Static<typeof JcdProdCreditSortDtoSchema>;

export const JcdProdCreditSortDto = {
  deserialize,
  schema: JcdProdCreditSortDtoSchema,
} as const;

function deserialize(val: unknown): JcdProdCreditSortDtoType {
  return Value.Parse(JcdProdCreditSortDtoSchema, val);
}
