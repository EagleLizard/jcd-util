import { JcdImageDef } from './jcd-v4-projects';

export enum JCD_V4_GALLERY_ENUM {
  ART = 'ART'
}

export type JcdV4GalleryKey = keyof typeof JCD_V4_GALLERY_ENUM;

export type GalleryDef = {
  gallery_key: JcdV4GalleryKey,
  images: JcdImageDef[];
};

const ART_GALLERY: GalleryDef = {
  gallery_key: 'ART',
  images: [
    [ 'g', 'art/01-gallery.png' ],
    [ 'g', 'art/02-gallery.png' ],
    [ 'g', 'art/03-gallery.png' ],
    [ 'g', 'art/04-gallery.png' ],
    [ 'g', 'art/05-gallery.png' ],
    [ 'g', 'art/06-gallery.png' ],
    [ 'g', 'art/07-gallery.png' ],
    [ 'g', 'art/08-gallery.jpg' ],
    [ 'g', 'art/09-gallery.png' ],
    [ 'g', 'art/10-gallery.png' ],
    [ 'g', 'art/11-gallery.png' ],
    [ 'g', 'art/12-gallery.jpg' ],
    [ 'g', 'art/13-gallery.png' ],
    [ 'g', 'art/14-gallery.png' ],
    [ 'g', 'art/15-gallery.jpg' ],
    [ 'g', 'art/16-gallery.png' ],
    [ 'g', 'art/17-gallery.png' ],
    [ 'g', 'art/18-gallery.jpg' ],
    [ 'g', 'art/19-gallery.png' ],
    [ 'g', 'art/20-gallery.jpg' ],
    [ 'g', 'art/21-gallery.png' ],
    [ 'g', 'art/22-gallery.jpg' ],
    [ 'g', 'art/23-gallery.png' ],
    [ 'g', 'art/24-gallery.jpg' ],
    [ 'g', 'art/25-gallery.png' ],
    [ 'g', 'art/26-gallery.jpg' ],
    [ 'g', 'art/27-gallery.png' ],
    [ 'g', 'art/28-gallery.png' ],
    [ 'g', 'art/29-gallery.png' ],
    [ 'g', 'art/30-gallery.png' ],
    [ 'g', 'art/31-gallery.png' ],
    [ 'g', 'art/32-gallery.jpg' ],
    [ 'g', 'art/33-gallery.png' ],
    [ 'g', 'art/34-gallery.png' ],
    [ 'g', 'art/35-gallery.png' ],
    [ 'g', 'art/36-gallery.jpg' ],
    [ 'g', 'art/37-gallery.png' ],
    [ 'g', 'art/38-gallery.jpg' ],
    [ 'g', 'art/39-gallery.png' ],
    [ 'g', 'art/40-gallery.jpg' ],
    [ 'g', 'art/41-gallery.jpg' ],
    [ 'g', 'art/42-gallery.png' ],
    [ 'g', 'art/43-gallery.png' ],
    [ 'g', 'art/44-gallery.jpg' ],
    [ 'g', 'art/45-gallery.png' ],
    [ 'g', 'art/46-gallery.jpg' ],
    [ 'g', 'art/47-gallery.jpg' ],
    [ 'g', 'art/48-gallery.png' ],
    [ 'g', 'art/49-gallery.png' ],
    [ 'g', 'art/50-gallery.png' ],
    [ 'g', 'art/51-gallery.jpg' ],
    [ 'g', 'art/52-gallery.png' ],
    [ 'g', 'art/53-gallery.jpg' ],
    [ 'g', 'art/54-gallery.png' ],
    [ 'g', 'art/55-gallery.jpg' ],
    [ 'g', 'art/56-gallery.jpg' ],
    [ 'g', 'art/57-gallery.jpg' ],
    [ 'g', 'art/58-gallery.jpg' ],
    [ 'g', 'art/59-gallery.png' ],
    [ 'g', 'art/60-gallery.jpg' ],
  ],
};

const JcdV4Galleries: GalleryDef[] = [
  ART_GALLERY,
];

export {
  JcdV4Galleries,
};
