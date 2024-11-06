
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const ImageV4Schema = Type.Object({
  id: Type.String(),
  projectKey: Type.String(),
  bucketFile: Type.String(),
  orderIdx: Type.Number(),
  active: Type.Boolean(),
  imageType: Type.Union([
    Type.Literal('TITLE'),
    Type.Literal('GALLERY'),
  ]),
});

export type ImageV4Type = Static<typeof ImageV4Schema>;

export const ImageV4 = {
  parse,
  schema: ImageV4Schema,
} as const;

function parse(val: unknown): ImageV4Type {
  return Value.Parse(ImageV4Schema, val);
}
