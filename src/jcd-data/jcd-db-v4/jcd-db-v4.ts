
import { DbClient, PgClient } from '../../lib/postgres-client';
import { Timer } from '../../util/timer';
import {
  JcdContribDef,
  JcdCreditDef,
  JcdImageDef,
  JcdProjectDef,
  JcdV4Projects,
  PressDef,
} from './jcd-v4-projects';
import { JcdProducer } from './jcd-producer';
import { JcdProdCredit, JcdProdCreditContrib } from './jcd-prod-credit';
import { JcdPress, Publication } from './jcd-press';
import { JcdProjectDtoType } from '../jcd-dto/jcd-project-dto';
import { DescriptionDto } from '../jcd-dto/description-dto';
import { JcdProjectDescDto } from '../jcd-dto/jcd-project-desc-dto';
import { JcdCreditDtoType, JcdCreditOrderDtoType } from '../jcd-dto/jcd-credit-dto';
import { PersonDtoType } from '../jcd-dto/person-dto';
import { OrgDtoType } from '../jcd-dto/org-dto';
import { JcdCreditContribDtoType } from '../jcd-dto/jcd-credit-contrib-dto';
import { JcdProdCreditDtoType } from '../jcd-dto/jcd-prod-credit-dto';
import { JcdProdCreditContribDtoType } from '../jcd-dto/jcd-prod-credit-contrib-dto';
import { JcdProducerDtoType } from '../jcd-dto/jcd-producer-dto';
import { PublicationDtoType } from '../jcd-dto/publication-dto';
import { JcdPressDtoType } from '../jcd-dto/jcd-press-dto';
import { JcdCredit, JcdCreditContrib } from './jcd-credit';
import { Org, Person } from './jcd-contrib';
import { Description, JcdProjectDesc } from './jcd-desc';
import { JcdProject } from './jcd-project';
import { JcdProjectVenueDtoType } from '../jcd-dto/jcd-project-venue-dto';
import { JcdProjectVenue, Venue } from './jcd-project-venue';
import { JcdImage } from './jcd-image';
import { JcdProjectSortDef, jcdProjectSortDefs } from './jcd-v4-sorts';
import { JcdProjectSort } from './jcd-project-sort';
import { JcdProjectSortKeyDtoType } from '../jcd-dto/jcd-project-sort-key-dto';
import { JcdImageDtoType } from '../jcd-dto/jcd-image-dto';
import { JcdCreditSort } from './jcd-credit-sort';
import { GalleryDef, JcdV4Galleries } from './jcd-v4-galleries';
import { JcdGalleryDtoType } from '../jcd-dto/jcd-gallery-dto';
import { JcdGallery } from './jcd-gallery';
import { JcdGalleryImage } from './jcd-gallery-image';
import { JcdGalleryImageDtoType } from '../jcd-dto/jcd-gallery-image-dto';

export async function jcdDbV4Main() {
  let projects = JcdV4Projects;
  // let projects = JcdV4Projects.slice(0, 5);
  // projects = JcdV4Projects.slice(0, 1);
  console.log(projects.map(proj => proj.project_key));

  let timer = Timer.start();

  let projPromises = projects.map(projectDef => {
    return upsertProject(PgClient, {
      projectDef,
    });
  });
  let upsertedProjectDtos = await Promise.all(projPromises);

  await PgClient.transact(async (client) => {
    let jcdProjectDtos = await JcdProject.getAll(client);
    let sortDefs = jcdProjectSortDefs.filter(sortDef => {
      let foundJcdProjectDto = jcdProjectDtos.find(projDto => {
        return sortDef[0] === projDto.project_key;
      });
      return foundJcdProjectDto !== undefined;
    });
    await insertProjectSorts(client, {
      sortDefs,
    });
  });

  for(let i = 0; i < upsertedProjectDtos.length; ++i) {
    let jcdProjectDto = upsertedProjectDtos[i];
    let currProject = projects[i];
    await upsertProjectDef({
      jcdProjectDef: currProject,
      jcdProjectDto,
    });
  }

  for(let i = 0; i < JcdV4Galleries.length; ++i) {
    let jcdGalleryDto = await PgClient.transact(async (client) => {
      return await upsertGalleryDef(client, {
        galleryDef: JcdV4Galleries[i],
      });
    });
    console.log(jcdGalleryDto[1].gallery_key);
  }

  await PgClient.end();

  let elapsedMs = timer.stop();
  console.log(`upserted ${projects.length} in ${elapsedMs} ms`);
}

async function upsertGalleryDef(client: DbClient, opts: {
  galleryDef: GalleryDef;
}) {
  let jcdGalleryDto = upsertGallery(client, {
    galleryKey: opts.galleryDef.gallery_key,
    imageDefs: opts.galleryDef.images,
  });
  return jcdGalleryDto;
}

async function upsertGallery(client: DbClient, opts: {
  galleryKey: GalleryDef['gallery_key'] | JcdProjectDef['project_key'];
  imageDefs: JcdImageDef[];
}): Promise<[(GalleryDef['gallery_key'] | JcdProjectDef['project_key']), JcdGalleryDtoType, [ JcdImageDef, JcdImageDtoType, JcdGalleryImageDtoType ][]]> {
  let jcdGalleryDto = await JcdGallery.get(client, opts.galleryKey);
  if(jcdGalleryDto === undefined) {
    jcdGalleryDto = await JcdGallery.insert(client, {
      gallery_key: opts.galleryKey,
    });
  }
  let jcdGalleryImageDtoTuples = await upsertJcdGalleryImages(client, {
    jcd_gallery_id: jcdGalleryDto.jcd_gallery_id,
    imageDefs: opts.imageDefs,
  });
  return [ opts.galleryKey, jcdGalleryDto, jcdGalleryImageDtoTuples ];
}

async function upsertJcdGalleryImages(client: DbClient, opts: {
  jcd_gallery_id: number;
  imageDefs: JcdImageDef[];
}) {
  let galleryImageDtoTuples: [ JcdImageDef, JcdImageDtoType, JcdGalleryImageDtoType ][] = [];
  for(let i = 0; i < opts.imageDefs.length; ++i) {
    let prevGalleryImageDtoTuple: [ JcdImageDef, JcdImageDtoType, JcdGalleryImageDtoType ] | undefined;
    let imageDef = opts.imageDefs[i];
    let insertAfterIdx: number;
    if((prevGalleryImageDtoTuple = galleryImageDtoTuples[i - 1]) !== undefined) {
      insertAfterIdx = prevGalleryImageDtoTuple[2].sort_order + 1;
    } else {
      insertAfterIdx = 1;
    }
    let jcdImageDto = await JcdImage.getByPath(client, {
      path: imageDef[1],
    });
    if(jcdImageDto === undefined) {
      jcdImageDto = await JcdImage.insert(client, {
        path: imageDef[1],
      });
    }
    let jcdGalleryImageDto = await JcdGalleryImage.get(client, {
      jcd_gallery_id: opts.jcd_gallery_id,
      jcd_image_id: jcdImageDto.jcd_image_id,
      kind: imageDtoKindFromDef(imageDef),
    });
    if(jcdGalleryImageDto === undefined) {
      console.log(`inserting [${imageDef[0]}, ${imageDef[1]}] at ${insertAfterIdx}`);
      jcdGalleryImageDto = await JcdGalleryImage.insert(client, {
        jcd_gallery_id: opts.jcd_gallery_id,
        jcd_image_id: jcdImageDto.jcd_image_id,
        kind: imageDtoKindFromDef(imageDef),
        sort_order: insertAfterIdx,
      });
    }
    galleryImageDtoTuples.push([
      imageDef,
      jcdImageDto,
      jcdGalleryImageDto,
    ]);
  }
  return galleryImageDtoTuples;
}

async function upsertProjectDef(opts: {
  jcdProjectDef: JcdProjectDef,
  jcdProjectDto: JcdProjectDtoType
}) {
  const {
    jcdProjectDef,
    jcdProjectDto,
  } = opts;

  let descDto = await upsertProjectDesc(PgClient, {
    text: jcdProjectDef.description.join('\n'),
    jcd_project_id: jcdProjectDto.jcd_project_id,
  });
  await upsertJcdProjectDesc(PgClient, {
    jcd_project_id: jcdProjectDto.jcd_project_id,
    description_id: descDto.description_id,
  });

  await upsertJcdVenue(PgClient, {
    jcd_project_id: jcdProjectDto.jcd_project_id,
    name: jcdProjectDef.venue,
  });

  let jcdCreditDtoTuples = await upsertJcdCredits(PgClient, {
    jcdProjectDef,
    jcd_project_id: jcdProjectDto.jcd_project_id,
  });
  await PgClient.transact(async (client) => {
    await insertJcdCreditSorts(client, {
      jcd_project_id: jcdProjectDto.jcd_project_id,
      // jcdCreditDefs: jcdProjectDef.credits,
      jcdCreditDtoTuples,
    });
  });

  let jcdProdCreditDtoTuples = await upsertJcdProdCredits(PgClient, {
    jcdProjectDef,
    jcd_project_id: jcdProjectDto.jcd_project_id,
  });
  // await PgClient.transact(async (client) => {
  //   await insertJcdProdCreditSorts(client, {
  //     jcd_project_id: jcdProjectDto.jcd_project_id,
  //     jcdProdCreditDtoTuples,
  //   });
  // });

  await PgClient.transact(async (client) => {
    await upsertJcdProducers(client, {
      jcdProjectDef,
      jcd_project_id: jcdProjectDto.jcd_project_id,
    });
  });

  await PgClient.transact(async (client) => {
    await upsertJcdPress(client, {
      jcdProjectDef,
      jcd_project_id: jcdProjectDto.jcd_project_id,
    });
  });

  await PgClient.transact(async (client) => {
    await upsertGallery(client, {
      galleryKey: jcdProjectDef.project_key,
      imageDefs: jcdProjectDef.images,
    });
  });
}

async function insertProjectSorts(client: DbClient, opts: {
  sortDefs: JcdProjectSortDef[];
}) {
  /*
    Only insert entries that are new. In other words, respect any entry
      that exists in the DB already.
    This is to protect against accidentally updating the sort order
      defined by the user if it exists already.
  _*/
  for(let i = 0; i < opts.sortDefs.length; ++i) {
    let currSortDef = opts.sortDefs[i];
    let jcdProjectDto = await JcdProject.getByKey(client, currSortDef[0]);
    if(jcdProjectDto === undefined) {
      throw new Error(`attempted to insert SortDef for jcd_project not in DB, sortDef: ${currSortDef[0]}`);
    }
    let jcdProjectSorts = await JcdProjectSort.getProjectSorts(client);
    let foundProjSortIdx = jcdProjectSorts.findIndex(projSort => {
      return currSortDef[0] === projSort.project_key;
    });
    if(foundProjSortIdx === -1) {
      let prevSortDef: JcdProjectSortDef | undefined;
      let insertAfterSortDto: JcdProjectSortKeyDtoType | undefined;
      if((prevSortDef = opts.sortDefs[i - 1]) !== undefined) {
        let insertAfterProjectSortIdx = jcdProjectSorts.findIndex(projSort => {
          return prevSortDef?.[0] === projSort.project_key;
        });
        insertAfterSortDto = jcdProjectSorts[insertAfterProjectSortIdx];
      }
      let insertSortOrder: number;
      if(insertAfterSortDto === undefined) {
        /*
          No entries found before this one,
            insert at beginning
        _*/
        insertSortOrder = 1;
      } else {
        /*
          insert after found previous sort entry
        _*/
        insertSortOrder = insertAfterSortDto.sort_order + 1;
      }
      let insertOutStr = `inserting ${jcdProjectDto.project_key} at ${insertSortOrder}`;
      if(insertAfterSortDto !== undefined) {
        insertOutStr += ` after ${insertAfterSortDto.project_key}`;
      }
      console.log(insertOutStr);
      await JcdProjectSort.insert(client, {
        jcd_project_id: jcdProjectDto.jcd_project_id,
        sort_order: insertSortOrder,
      });
    }
  }
}

async function insertJcdCreditSorts(client: DbClient, opts: {
  jcd_project_id: number;
  jcdCreditDtoTuples: [JcdCreditDef, JcdCreditDtoType, [(PersonDtoType | OrgDtoType), JcdCreditContribDtoType][]][];
}) {
  for(let i = 0; i < opts.jcdCreditDtoTuples.length; ++i) {
    let currCreditDtoTuple = opts.jcdCreditDtoTuples[i];
    let jcdCreditDto = currCreditDtoTuple[1];
    let sortedJcdCreditDtos = await JcdCredit.getAllByProject(client, {
      jcd_project_id: opts.jcd_project_id,
    });
    // console.log(sortedJcdCreditDtos);
    let foundSortedJcdCreditIdx = sortedJcdCreditDtos.findIndex(sortedCreditDto => {
      return jcdCreditDto.jcd_credit_id === sortedCreditDto.jcd_credit_id;
    });
    if(foundSortedJcdCreditIdx === -1) {
      /*
        If not exist, insert after previous entry's
          sort_order. If previous entry not in sort order,
          insert at beginning
      _*/
      let prevCreditDto: JcdCreditDtoType | undefined;
      let insertAfterDto: JcdCreditOrderDtoType | undefined;
      if((prevCreditDto = opts.jcdCreditDtoTuples[i - 1]?.[1]) !== undefined) {
        let insertAfterDtoIdx = sortedJcdCreditDtos.findIndex(sortedCreditDto => {
          return prevCreditDto?.jcd_credit_id === sortedCreditDto.jcd_credit_id;
        });
        if(insertAfterDtoIdx !== -1) {
          insertAfterDto = sortedJcdCreditDtos[insertAfterDtoIdx];
        }
      }
      let insertSortOrder: number;
      if(insertAfterDto === undefined) {
        insertSortOrder = 1;
      } else {
        insertSortOrder = insertAfterDto.sort_order + 1;
      }
      console.log('');
      console.log(currCreditDtoTuple[0]);
      let insertOutStr = `inserting at ${insertSortOrder}`;
      if(insertAfterDto !== undefined) {
        insertOutStr += ` after: ${JSON.stringify(insertAfterDto)}`;
      }
      console.log(insertOutStr);
      await JcdCreditSort.insert(client, {
        jcd_project_id: opts.jcd_project_id,
        jcd_credit_id: jcdCreditDto.jcd_credit_id,
        sort_order: insertSortOrder,
      });
    }
  }
}

function imageDtoKindFromDef(def: JcdImageDef): JcdGalleryImageDtoType['kind'] {
  switch(def[0]) {
    case 'g':
      return 'gallery';
    case 't':
      return 'title';
    default:
      console.error(def);
      throw new Error(`Invalid JcdImageDef kind: ${def[0]}`);
  }
}

async function upsertJcdVenue(client: DbClient, opts: {
  jcd_project_id: number;
  name: string;
}): Promise<JcdProjectVenueDtoType> {
  let venueDto = await Venue.getByName(client, {
    name: opts.name,
  });
  if(venueDto === undefined) {
    venueDto = await Venue.insert(client, {
      name: opts.name,
    });
  }
  let jcdProjectVenueDto = await JcdProjectVenue.get(client, {
    jcd_project_id: opts.jcd_project_id,
    venue_id: venueDto.venue_id,
  });
  if(jcdProjectVenueDto === undefined) {
    jcdProjectVenueDto = await JcdProjectVenue.insert(client, {
      jcd_project_id: opts.jcd_project_id,
      venue_id: venueDto.venue_id,
    });
  }
  return jcdProjectVenueDto;
}

async function upsertJcdPress(client: DbClient, opts: {
  jcdProjectDef: JcdProjectDef;
  jcd_project_id: number;
}): Promise<[PressDef, PublicationDtoType, JcdPressDtoType][]> {
  let jcdPressDtoTuples: [PressDef, PublicationDtoType, JcdPressDtoType][] = [];
  for(let i = 0; i < opts.jcdProjectDef.press.length; ++i) {
    let prevPressDtoTuple: [PressDef, PublicationDtoType, JcdPressDtoType] | undefined;
    let currPressDef = opts.jcdProjectDef.press[i];
    let insertAfterIdx: number;
    if((prevPressDtoTuple = jcdPressDtoTuples[i - 1]) !== undefined) {
      insertAfterIdx = prevPressDtoTuple[2].sort_order + 1;
    } {
      insertAfterIdx = 1;
    }
    let jcdPressDtoTuple = await upsertJcdPressItem(client, {
      jcd_project_id: opts.jcd_project_id,
      pressDef: currPressDef,
      sort_order: insertAfterIdx,
    });
    jcdPressDtoTuples.push(jcdPressDtoTuple);
  }
  return jcdPressDtoTuples;
}

async function upsertJcdPressItem(client: DbClient, opts: {
  jcd_project_id: number;
  pressDef: PressDef;
  sort_order: number;
}): Promise<[PressDef, PublicationDtoType, JcdPressDtoType]> {
  let publicationDto = await upsertPublication(client, {
    name: opts.pressDef.publication,
  });
  let jcdPressDto = await JcdPress.get(client, {
    jcd_project_id: opts.jcd_project_id,
    publication_id: publicationDto.publication_id,
  });
  if(jcdPressDto === undefined) {
    jcdPressDto = await JcdPress.insert(client, {
      jcd_project_id: opts.jcd_project_id,
      publication_id: publicationDto.publication_id,
      link_text: opts.pressDef.link.label,
      link_url: opts.pressDef.link.url,
      sort_order: opts.sort_order,
      description: opts.pressDef.description,
    });
  }
  return [ opts.pressDef, publicationDto, jcdPressDto ];
}

async function upsertPublication(client: DbClient, opts: {
  name: string;
}): Promise<PublicationDtoType> {
  let publicationDto = await Publication.getByName(client, {
    name: opts.name,
  });
  if(publicationDto === undefined) {
    publicationDto = await Publication.insert(client, {
      name: opts.name,
    });
  }
  return publicationDto;
}

async function upsertJcdProducers(client: DbClient, opts: {
  jcdProjectDef: JcdProjectDef;
  jcd_project_id: number;
}): Promise<[JcdContribDef, (PersonDtoType | OrgDtoType), JcdProducerDtoType][]> {
  let jcdProducerDtoTuples: [JcdContribDef, (PersonDtoType | OrgDtoType), JcdProducerDtoType][] = [];

  for(let i = 0; i < opts.jcdProjectDef.producer.length; ++i) {
    let prevProducerDtoTuple: [JcdContribDef, (PersonDtoType | OrgDtoType), JcdProducerDtoType] | undefined;
    let currProducerDef = opts.jcdProjectDef.producer[i];
    let insertAfterIdx: number;
    if((prevProducerDtoTuple = jcdProducerDtoTuples[i - 1]) !== undefined) {
      insertAfterIdx = prevProducerDtoTuple[2].sort_order + 1;
    } else {
      insertAfterIdx = 1;
    }
    let jcdProducerDtoTuple = await upsertJcdProducer(client, {
      jcd_project_id: opts.jcd_project_id,
      producerDef: currProducerDef,
      sort_order: insertAfterIdx,
    });
    jcdProducerDtoTuples.push(jcdProducerDtoTuple);
  }

  return jcdProducerDtoTuples;
}

async function upsertJcdProducer(client: DbClient, opts: {
  jcd_project_id: number;
  producerDef: JcdContribDef;
  sort_order: number;
}): Promise<[JcdContribDef, (PersonDtoType | OrgDtoType), JcdProducerDtoType]> {
  let contribDto = await upsertContrib(client, {
    contribDef: opts.producerDef,
  });
  let jcdProducerDto = await JcdProducer.get(client, {
    jcd_project_id: opts.jcd_project_id,
    jcdContribDto: contribDto,
  });
  if(jcdProducerDto === undefined) {
    jcdProducerDto = await JcdProducer.insert(client, {
      jcd_project_id: opts.jcd_project_id,
      jcdContribDto: contribDto,
      sort_order: opts.sort_order,
    });
  }
  return [ opts.producerDef, contribDto, jcdProducerDto ];
}

async function upsertJcdProdCredits(client: DbClient, opts: {
  jcdProjectDef: JcdProjectDef;
  jcd_project_id: number;
}): Promise<[JcdCreditDef, JcdProdCreditDtoType, [(PersonDtoType | OrgDtoType), JcdProdCreditContribDtoType][]][]> {
  let jcdProdCreditTuples: [JcdCreditDef, JcdProdCreditDtoType, [(PersonDtoType | OrgDtoType), JcdProdCreditContribDtoType][]][] = [];
  for(let i = 0; i < opts.jcdProjectDef.prod_credits.length; ++i) {
    let prevCreditDtoTuple: [JcdCreditDef, JcdProdCreditDtoType, [(PersonDtoType | OrgDtoType), JcdProdCreditContribDtoType][]];
    let currCreditDef = opts.jcdProjectDef.prod_credits[i];
    let insertAfterIdx: number;
    if((prevCreditDtoTuple = jcdProdCreditTuples[i - 1]) !== undefined) {
      insertAfterIdx = prevCreditDtoTuple[1].sort_order + 1;
    } else {
      insertAfterIdx = 1;
    }
    let currCreditDtoTuple = await upsertJcdProdCredit(client, {
      jcd_project_id: opts.jcd_project_id,
      creditDef: currCreditDef,
      sort_order: insertAfterIdx,
    });
    jcdProdCreditTuples.push(currCreditDtoTuple);
  }
  return jcdProdCreditTuples;
}

async function upsertJcdProdCredit(client: DbClient, opts: {
  jcd_project_id: number;
  creditDef: JcdCreditDef;
  sort_order: number;
}): Promise<[JcdCreditDef, JcdProdCreditDtoType, [(PersonDtoType | OrgDtoType), JcdProdCreditContribDtoType][]]> {
  let currCreditDto = await JcdProdCredit.upsert(client, {
    jcd_project_id: opts.jcd_project_id,
    jcdCreditDef: opts.creditDef,
    sort_order: opts.sort_order,
  });
  let jcdProdCreditContribDtoTuples = await upsertJcdProdCreditContribs(client, {
    jcdProdCreditDto: currCreditDto,
    prodCreditDef: opts.creditDef,
  });
  return [ opts.creditDef, currCreditDto, jcdProdCreditContribDtoTuples ];
}

async function upsertJcdProdCreditContribs(client: DbClient, opts: {
  jcdProdCreditDto: JcdProdCreditDtoType;
  prodCreditDef: JcdCreditDef;
}) {
  let jcdProdCreditContribTuples: [(PersonDtoType | OrgDtoType), JcdProdCreditContribDtoType][] = [];
  for(let i = 0; i < opts.prodCreditDef.contribs.length; ++i) {
    let prevCreditContribDtoTuple: [(PersonDtoType | OrgDtoType), JcdProdCreditContribDtoType] | undefined;
    let currContrib = opts.prodCreditDef.contribs[i];
    let currContribDto = await upsertContrib(client, {
      contribDef: currContrib,
    });
    let insertAfterIdx: number;
    if((prevCreditContribDtoTuple = jcdProdCreditContribTuples[i - 1]) !== undefined) {
      insertAfterIdx = prevCreditContribDtoTuple[1].sort_order + 1;
    } else {
      insertAfterIdx = 1;
    }
    let jcdProdCreditContribDto = await JcdProdCreditContrib.upsert(client, {
      jcdProdCreditDto: opts.jcdProdCreditDto,
      jcdContribDto: currContribDto,
      sort_order: insertAfterIdx,
    });
    jcdProdCreditContribTuples.push([ currContribDto, jcdProdCreditContribDto ]);
  }
  return jcdProdCreditContribTuples;
}

async function upsertJcdCredits(client: DbClient, opts: {
  jcdProjectDef: JcdProjectDef;
  jcd_project_id: number;
}) {
  let jcdCreditDtoTuples: [JcdCreditDef, JcdCreditDtoType, [(PersonDtoType | OrgDtoType), JcdCreditContribDtoType][]][] = [];
  for(let i = 0; i < opts.jcdProjectDef.credits.length; ++i) {
    let currCredit = opts.jcdProjectDef.credits[i];
    let currCreditDto = await upsertJcdCredit(client, {
      creditDef: currCredit,
      jcd_project_id: opts.jcd_project_id,
    });
    let jcdCreditContribDtoTuples = await upsertJcdCreditContribs(client, {
      jcdCreditDto: currCreditDto,
      creditDef: currCredit,
    });
    jcdCreditDtoTuples.push([
      currCredit,
      currCreditDto,
      jcdCreditContribDtoTuples,
    ]);
  }
  return jcdCreditDtoTuples;
}

async function upsertJcdCreditContribs(client: DbClient, opts: {
  jcdCreditDto: JcdCreditDtoType;
  creditDef: JcdCreditDef;
}) {
  let jcdCreditContribDtoTuples: [(PersonDtoType | OrgDtoType), JcdCreditContribDtoType][] = [];
  for(let i = 0; i < opts.creditDef.contribs.length; ++i) {
    let prevCreditContribDtoTuple: [(PersonDtoType | OrgDtoType), JcdCreditContribDtoType] | undefined;
    let currContrib = opts.creditDef.contribs[i];
    let currContribDto = await upsertContrib(client, {
      contribDef: currContrib,
    });
    let insertAfterIdx: number;
    if((prevCreditContribDtoTuple = jcdCreditContribDtoTuples[i - 1]) !== undefined) {
      insertAfterIdx = prevCreditContribDtoTuple[1].sort_order + 1;
    } else {
      insertAfterIdx = 1;
    }
    let jcdCreditContribDto = await upsertJcdCreditContrib(client, {
      jcdCreditDto: opts.jcdCreditDto,
      jcdContribDto: currContribDto,
      sort_order: insertAfterIdx,
    });
    jcdCreditContribDtoTuples.push([ currContribDto, jcdCreditContribDto ]);
  }
  return jcdCreditContribDtoTuples;
}

async function upsertJcdCreditContrib(client: DbClient, opts: {
  jcdCreditDto: JcdCreditDtoType;
  jcdContribDto: PersonDtoType | OrgDtoType;
  sort_order: number;
}): Promise<JcdCreditContribDtoType> {
  let jcdCreditContribDto = await JcdCreditContrib.get(client, {
    jcd_credit_id: opts.jcdCreditDto.jcd_credit_id,
    jcdContribDto: opts.jcdContribDto,
  });
  if(jcdCreditContribDto !== undefined) {
    return jcdCreditContribDto;
  }
  jcdCreditContribDto = await JcdCreditContrib.insert(client, {
    jcd_credit_id: opts.jcdCreditDto.jcd_credit_id,
    jcdContribDto: opts.jcdContribDto,
    sort_order: opts.sort_order,
  });
  return jcdCreditContribDto;
}

async function upsertJcdCredit(client: DbClient, opts: {
  creditDef: JcdCreditDef,
  jcd_project_id: number,
}): Promise<JcdCreditDtoType> {
  // console.log(opts.creditDef);
  /*
    first, upsert the credit_contrib
   */
  let jcdCreditDto = await JcdCredit.get(client, {
    label: opts.creditDef.label,
    jcd_project_id: opts.jcd_project_id,
  });
  if(jcdCreditDto !== undefined) {
    return jcdCreditDto;
  }
  jcdCreditDto = await JcdCredit.insert(client, {
    label: opts.creditDef.label,
    jcd_project_id: opts.jcd_project_id,
  });
  return jcdCreditDto;
}

async function upsertContrib(client: DbClient, opts: {
  contribDef: JcdContribDef,
}): Promise<PersonDtoType | OrgDtoType> {
  let contribDto: PersonDtoType | OrgDtoType;
  switch(opts.contribDef[0]) {
    case 'p':
      contribDto = await upsertPerson(client, {
        name: opts.contribDef[1],
      });
      break;
    case 'o':
      contribDto = await upsertOrg(client, {
        name: opts.contribDef[1],
      });
      break;
    default:
      throw new Error(`Unsupported contrib type: ${opts.contribDef[0]}`);
  }
  return contribDto;
}

async function upsertPerson(client: DbClient, opts: {
  name: string,
}): Promise<PersonDtoType> {
  let personDto = await Person.getByName(client, opts.name);
  if(personDto !== undefined) {
    return personDto;
  }
  personDto = await Person.insert(client, opts);
  return personDto;
}

async function upsertOrg(client: DbClient, opts: {
  name: string;
}): Promise<OrgDtoType> {
  let orgDto = await Org.getByName(client, opts.name);
  if(orgDto !== undefined) {
    return orgDto;
  }
  orgDto = await Org.insert(client, opts);
  return orgDto;
}

async function upsertJcdProjectDesc(client: DbClient, opts: {
  jcd_project_id: number,
  description_id: number,
}): Promise<JcdProjectDescDto> {
  let jcdProjDescDto = await JcdProjectDesc.get(client, {
    jcd_project_id: opts.jcd_project_id,
    description_id: opts.description_id,
  });
  if(jcdProjDescDto !== undefined) {
    return jcdProjDescDto;
  }
  jcdProjDescDto = await JcdProjectDesc.insert(client, opts);
  return jcdProjDescDto;
}

async function upsertProjectDesc(client: DbClient, opts: {
  text: string;
  jcd_project_id: number;
}): Promise<DescriptionDto> {
  let descDto = await Description.getByText(client, {
    text: opts.text,
    jcd_project_id: opts.jcd_project_id,
  });
  if(descDto !== undefined) {
    return descDto;
  }
  descDto = await Description.insert(client, {
    text: opts.text,
  });
  return descDto;
}

async function upsertProject(client: DbClient, opts: {
  projectDef: JcdProjectDef;
}): Promise<JcdProjectDtoType> {
  let jcdProjectDto: JcdProjectDtoType | undefined;
  jcdProjectDto = await JcdProject.getByKey(client, opts.projectDef.project_key);
  if(jcdProjectDto !== undefined) {
    return jcdProjectDto;
  }
  jcdProjectDto = await JcdProject.insert(client, opts.projectDef);
  return jcdProjectDto;
}
