
export const ImgSzs = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
] as const;
export type ImgSz = typeof ImgSzs[number];
