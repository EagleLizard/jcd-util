
export const ImgSzs = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
] as const;
export type ImgSz = typeof ImgSzs[number];
