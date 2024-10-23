
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { JcdImageDto } from './jcd-image-dto';
import { JcdProjectImageSortDto } from './jcd-project-image-sort-dto';

/*
  jcd_project_image_id SERIAL PRIMARY KEY,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  kind JCD_PROJECT_IMAGE_KIND NOT NULL,

  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  jcd_image_id INT references jcd_image(jcd_image_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

const JcdProjectImageDtoSchema = Type.Object({
  jcd_project_image_id: Type.Number(),
  active: Type.Boolean(),
  kind: Type.Union([
    Type.Literal('gallery'),
    Type.Literal('title'),
  ]),
  jcd_project_id: Type.Number(),
  jcd_image_id: Type.Number(),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type JcdProjectImageDtoType = Static<typeof JcdProjectImageDtoSchema>;

export const JcdProjectImageDto = {
  deserialize,
  schema: JcdProjectImageDtoSchema,
} as const;

function deserialize(val: unknown): JcdProjectImageDtoType {
  return Value.Parse(JcdProjectImageDtoSchema, val);
}

const JcdProjectImageJoinDtoSchema = Type.Composite([
  JcdProjectImageDtoSchema,
  Type.Object({
    path: JcdImageDto.schema.properties.path,
    sort_order: JcdProjectImageSortDto.schema.properties.sort_order,
  }),
]);

export type JcdProjectImageJoinDtoType = Static<typeof JcdProjectImageJoinDtoSchema>;

export const JcdProjectImageJoinDto = {
  deserialize: parseJcdProjectImageJoin,
} as const;

function parseJcdProjectImageJoin(val: unknown): JcdProjectImageJoinDtoType {
  return Value.Parse(JcdProjectImageJoinDtoSchema, val);
}
