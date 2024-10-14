
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  org_id SERIAL PRIMARY KEY,
  name TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

const OrgDtoSchema = Type.Object({
  org_id: Type.Number(),
  name: Type.String(),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type OrgDtoType = Static<typeof OrgDtoSchema>;

export const orgDto = {
  deserialize,
} as const;

function deserialize(val: unknown): OrgDtoType {
  return Value.Parse(OrgDtoSchema, val);
}

// export class OrgDto implements OrgDtoType {
//   constructor(
//     public org_id: number,
//     public name: string,
//     public created_at: Date,
//     public last_modified: Date,
//   ) {}

//   static deserialize(val: unknown): OrgDto {
//     let parsedOrg = Value.Parse(OrgDtoSchema, val);
//     let orgDto = new OrgDto(
//       parsedOrg.org_id,
//       parsedOrg.name,
//       parsedOrg.created_at,
//       parsedOrg.last_modified,
//     );
//     return orgDto;
//   }
// }
