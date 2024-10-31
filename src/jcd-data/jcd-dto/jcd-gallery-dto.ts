
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  jcd_gallery_id SERIAL PRIMARY KEY,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  gallery_key TEXT NOT NULL UNIQUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
_*/

const JcdGalleryDtoSchema = Type.Object({
  jcd_gallery_id: Type.Number(),
  active: Type.Boolean(),
  gallery_key: Type.String(),

  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type JcdGalleryDtoType = Static<typeof JcdGalleryDtoSchema>;

export const JcdGalleryDto = {
  deserialize,
};

function deserialize(val: unknown): JcdGalleryDtoType {
  return Value.Parse(JcdGalleryDtoSchema, val);
}
