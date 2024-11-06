
import { GalleryV4, GalleryV4Type } from './gallery-v4';
import { ProjectListItemV4 } from './project-v4-list-item';
import { Timer } from '../util/timer';

let baseUrl = 'http://127.0.0.1:4446';

export async function jcdV4ApiMain(cmdArgs: string[]) {
  console.log('jcd-api');
  let projectInfos = await getProjects();
  let galleries: GalleryV4Type[] = [];
  // let galleryPromises: Promise<GalleryV4Type>[] = [];
  let galleryKeys = [
    ...projectInfos.map(projectInfo => projectInfo.projectKey),
    'ART',
  ];
  for(let i = 0; i < galleryKeys.length; ++i) {
    let galleryKey = galleryKeys[i];
    // let galleryImages = await getGallery(galleryKey);
    let galleryImages = await getGallery(galleryKey);
    galleries.push(galleryImages);
    // let galleryPromise = getGallery(galleryKey);
    // galleryPromises.push(galleryPromise);
  }
  // galleries = await Promise.all(galleryPromises);
}

async function getProjects() {
  let req = await fetch(`${baseUrl}/jcd/v1/project`);
  let rawRes = await req.json();
  if(!Array.isArray(rawRes)) {
    throw new Error(`expected array, received: ${typeof rawRes}`);
  }
  let projectInfos = rawRes.map(ProjectListItemV4.parse);
  return projectInfos;
}

async function getGallery(projectKey: string): Promise<GalleryV4Type> {
  let req = await fetch(`${baseUrl}/jcd/v1/project/images/${projectKey}`);
  let rawRes = await req.json();
  let galleryImages = GalleryV4.parse(rawRes);
  return galleryImages;
}
