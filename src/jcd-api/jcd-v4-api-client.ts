
import { GalleryV4, GalleryV4Type } from './gallery-v4';
import { ProjectListItemV4 } from './project-v4-list-item';
import { TimedFetch } from './timed-fetch';

const baseUrl = 'http://127.0.0.1:4446';

export class JcdV4ApiClient {
  timedFetch: TimedFetch;

  constructor(
    timedFetch?: TimedFetch,
  ) {
    this.timedFetch = timedFetch ?? new TimedFetch();
  }

  async getProject(projectKey: string) {
    let rawRes = await this.timedFetch.fetchJson(`${baseUrl}/jcd/v1/project/${projectKey}`);
    return rawRes;
  }

  async getProjects() {
    let rawRes = await this.timedFetch.fetchJson(`${baseUrl}/jcd/v1/project`);
    if(!Array.isArray(rawRes)) {
      throw new Error(`expected array, received: ${typeof rawRes}`);
    }
    let projectInfos = rawRes.map(ProjectListItemV4.parse);
    return projectInfos;
  }

  async getGallery(galleryKey: string): Promise<GalleryV4Type> {
    let rawRes = await this.timedFetch.fetchJson(`${baseUrl}/jcd/v1/project/images/${galleryKey}`);
    let galleryImages = GalleryV4.parse(rawRes);
    return galleryImages;
  }
}
