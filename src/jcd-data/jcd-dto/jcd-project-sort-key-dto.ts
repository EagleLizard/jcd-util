
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

import { JcdProjectSortDto } from './jcd-project-sort-dto';
import { JcdProjectDto } from './jcd-project-dto';

/*
  For querying the list with he project's project_key
_*/

let JcdProjectSortKeyDtoSchema = Type.Composite([
  JcdProjectSortDto.schema,
  Type.Object({
    project_key: JcdProjectDto.schema.properties.project_key,
  }),
]);

export type JcdProjectSortKeyDtoType = Static<typeof JcdProjectSortKeyDtoSchema>;

export const JcdProjectSortKeyDto = {
  deserialize
} as const;

function deserialize(val: unknown): JcdProjectSortKeyDtoType {
  return Value.Parse(JcdProjectSortKeyDtoSchema, val);
}
