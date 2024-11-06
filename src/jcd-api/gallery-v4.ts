import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { ImageV4 } from './image-v4';

const GalleryV4Schema = Type.Array(ImageV4.schema);

export type GalleryV4Type = Static<typeof GalleryV4Schema>;

export const GalleryV4 = {
  parse,
} as const;

function parse(val: unknown): GalleryV4Type {
  return Value.Parse(GalleryV4Schema, val);
}
