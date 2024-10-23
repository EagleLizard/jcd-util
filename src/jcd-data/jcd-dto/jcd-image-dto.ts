
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  jcd_image_id SERIAL PRIMARY KEY,
  path TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

const JcdImageDtoSchema = Type.Object({
  jcd_image_id: Type.Number(),
  path: Type.String(),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type JcdImageDtoType = Static<typeof JcdImageDtoSchema>;

export const JcdImageDto = {
  deserialize,
  schema: JcdImageDtoSchema,
} as const;

function deserialize(val: unknown): JcdImageDtoType {
  return Value.Parse(JcdImageDtoSchema, val);
}
