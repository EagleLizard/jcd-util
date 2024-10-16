
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  jcd_press_id SERIAL PRIMARY KEY,
  description TEXT,
  link_text TEXT NOT NULL,
  link_url TEXT NOT NULL,

  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  publication_id INT references publication(publication_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

const JcdPressDtoSchema = Type.Object({
  jcd_press_id: Type.Number(),
  description: Type.Union([
    Type.String(),
    Type.Null(),
  ]),
  link_text: Type.String(),
  link_url: Type.String(),
  jcd_project_id: Type.Number(),
  publication_id: Type.Number(),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type JcdPressDtoType = Static<typeof JcdPressDtoSchema>;

export const JcdPressDto = {
  deserialize,
} as const;

function deserialize(val: unknown): JcdPressDtoType {
  return Value.Parse(JcdPressDtoSchema, val);
}
