
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  jcd_gallery_image_id SERIAL PRIMARY KEY,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  kind JCD_GALLERY_IMAGE_KIND NOT NULL,
  sort_order  INT NOT NULL,

  jcd_gallery_id INT references jcd_gallery(jcd_gallery_id) ON DELETE CASCADE NOT NULL,
  jcd_image_id INT references jcd_image(jcd_image_id) ON DELETE CASCADE NOT NULL,
  UNIQUE(sort_order, jcd_gallery_id) deferrable initially immediate,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
_*/

const JcdGalleryImageDtoSchema = Type.Object({
  jcd_gallery_image_id: Type.Number(),
  active: Type.Boolean(),
  sort_order: Type.Number(),
  jcd_gallery_id: Type.Number(),
  jcd_image_id: Type.Number(),
  kind: Type.Union([
    Type.Literal('gallery'),
    Type.Literal('title'),
  ]),

  created_at: Type.Date(),
  last_modified: Type.Date(),
});

export type JcdGalleryImageDtoType = Static<typeof JcdGalleryImageDtoSchema>;

export const JcdGalleryImageDto = {
  deserialize,
} as const;

function deserialize(val: unknown): JcdGalleryImageDtoType {
  return Value.Parse(JcdGalleryImageDtoSchema, val);
}
