
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  jcd_project_image_sort_id SERIAL PRIMARY KEY,
  sort_order INT NOT NULL,

  jcd_project_image_id INT references jcd_project_image(jcd_project_image_id) NOT NULL,
  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  UNIQUE (jcd_project_image_id, jcd_project_id, sort_order),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
_*/

const JcdProjectImageSortDtoSchema = Type.Object({
  jcd_project_image_sort_id: Type.Number(),
  sort_order: Type.Number(),
  jcd_project_image_id: Type.Number(),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type JcdProjectImageSortDtoType = Static<typeof JcdProjectImageSortDtoSchema>;

export const JcdProjectImageSortDto = {
  deserialize: parseJcdProjectImageSort,
  schema: JcdProjectImageSortDtoSchema,
} as const;

function parseJcdProjectImageSort(val: unknown): val is JcdProjectImageSortDtoType {
  return Value.Parse(JcdProjectImageSortDtoSchema, val);
}
