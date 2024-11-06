
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const ProjectV4ListItemSchema = Type.Object({
  projectKey: Type.String(),
  route: Type.String(),
  title: Type.String(),
  titleUri: Type.String(),
  orderIndex: Type.Number(),
});

type ProjectV4ListItemType = Static<typeof ProjectV4ListItemSchema>;

export const ProjectListItemV4 = {
  parse,
} as const;

function parse(val: unknown): ProjectV4ListItemType {
  return Value.Parse(ProjectV4ListItemSchema, val);
}
