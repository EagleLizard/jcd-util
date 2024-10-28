
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  jcd_credit_sort_id SERIAL PRIMARY KEY,
  sort_order INT NOT NULL UNIQUE,

  jcd_credit_id INT references jcd_credit(jcd_credit_id) NOT NULL UNIQUE,
  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  UNIQUE(jcd_credit_id, jcd_project_id, sort_order),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
_*/

const JcdCreditSortDtoSchema = Type.Object({
  jcd_credit_sort_id: Type.Number(),
  sort_order: Type.Number(),
  jcd_credit_id: Type.Number(),
  jcd_project_id: Type.Number(),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type JcdCreditSortDtoType = Static<typeof JcdCreditSortDtoSchema>;

export const JcdCreditSortDto = {
  deserialize,
  schema: JcdCreditSortDtoSchema,
} as const;

function deserialize(val: unknown): JcdCreditSortDtoType {
  return Value.Parse(JcdCreditSortDtoSchema, val);
}
