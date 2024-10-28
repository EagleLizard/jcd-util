
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { JcdCreditSortDto } from './jcd-credit-sort-dto';

/*
  jcd_credit_id SERIAL PRIMARY KEY,

  label TEXT NOT NULL,
  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

const JcdCreditDtoSchema = Type.Object({
  jcd_credit_id: Type.Number(),
  label: Type.String(),
  jcd_project_id: Type.Number(),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type JcdCreditDtoType = Static<typeof JcdCreditDtoSchema>;

export const JcdCreditDto = {
  deserialize,
} as const;

function deserialize(val: unknown): JcdCreditDtoType {
  return Value.Parse(JcdCreditDtoSchema, val);
}

const JcdCreditOrderDtoSchema = Type.Composite([
  JcdCreditDtoSchema,
  Type.Object({
    sort_order: JcdCreditSortDto.schema.properties.sort_order,
  }),
]);

export type JcdCreditOrderDtoType = Static<typeof JcdCreditOrderDtoSchema>;

export const JcdCreditOrderDto = {
  deserialize: parseJcdCreditOrder,
} as const;

function parseJcdCreditOrder(val: unknown): JcdCreditOrderDtoType {
  return Value.Parse(JcdCreditOrderDtoSchema, val);
}
