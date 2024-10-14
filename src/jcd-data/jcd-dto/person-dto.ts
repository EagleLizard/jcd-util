
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const PersonDtoSchema = Type.Object({
  person_id: Type.Number(),
  name: Type.String(),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type PersonDtoType = Static<typeof PersonDtoSchema>;

export const personDto = {
  deserialize,
} as const;

function deserialize(val: unknown): PersonDtoType {
  return Value.Parse(PersonDtoSchema, val);
}

// export class PersonDto implements PersonDtoType {
//   constructor(
//     public person_id: number,
//     public name: string,
//     public created_at: Date,
//     public last_modified: Date,
//   ) {}

//   static deserialize(val: unknown): PersonDto {
//     let parsedPerson = Value.Parse(PersonDtoSchema, val);
//     let personDto = new PersonDto(
//       parsedPerson.person_id,
//       parsedPerson.name,
//       parsedPerson.created_at,
//       parsedPerson.last_modified,
//     );
//     return personDto;
//   }
// }
