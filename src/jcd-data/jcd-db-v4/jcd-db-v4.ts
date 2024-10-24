
import assert from 'assert';

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
import { JcdCreditDtoType } from '../jcd-dto/jcd-credit-dto';
import { PersonDtoType, PersonDto } from '../jcd-dto/person-dto';
import { OrgDtoType, OrgDto } from '../jcd-dto/org-dto';
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
import { JcdProjectImageDtoType, JcdProjectImageJoinDtoType } from '../jcd-dto/jcd-project-image-dto';
import { JcdImage } from './jcd-image';
import { JcdProjectImage } from './jcd-project-image';
import { JcdProjectSortDef, jcdProjectSortDefs } from './jcd-v4-sorts';
import { JcdProjectSort } from './jcd-project-sort';
import { JcdProjectSortKeyDtoType } from '../jcd-dto/jcd-project-sort-key-dto';
import { JcdProjectImageSort } from './jcd-project-image-sort';
import { JcdImageDtoType } from '../jcd-dto/jcd-image-dto';

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
  await PgClient.end();

  let elapsedMs = timer.stop();
  console.log(`upserted ${projects.length} in ${elapsedMs} ms`);
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

  await upsertJcdCredits(PgClient, {
    jcdProjectDef,
    jcd_project_id: jcdProjectDto.jcd_project_id,
  });
  await upsertJcdProdCredits(PgClient, {
    jcdProjectDef,
    jcd_project_id: jcdProjectDto.jcd_project_id,
  });
  await upsertJcdProducers(PgClient, {
    jcdProjectDef,
    jcd_project_id: jcdProjectDto.jcd_project_id,
  });
  await upsertJcdPress(PgClient, {
    jcdProjectDef,
    jcd_project_id: jcdProjectDto.jcd_project_id,
  });
  let jcdImageDtoTuples = await upsertJcdImages(PgClient, {
    jcd_project_id: jcdProjectDto.jcd_project_id,
    jcdImageDefs: jcdProjectDef.images,
  });
  await PgClient.transact(async (client) => {
    await insertJcdProjectImageSorts(client, {
      jcd_project_id: jcdProjectDto.jcd_project_id,
      jcdImageDefs: jcdProjectDef.images,
      jcdImageDtoTuples,
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

async function insertJcdProjectImageSorts(client: DbClient, opts: {
  jcd_project_id: number;
  jcdImageDefs: JcdImageDef[];
  jcdImageDtoTuples: [JcdImageDtoType, JcdProjectImageDtoType][],
}) {
  for(let i = 0; i < opts.jcdImageDefs.length; ++i) {
    let currImageDef = opts.jcdImageDefs[i];
    let foundImageDtoTuple = opts.jcdImageDtoTuples.find(dtoTuple => {
      return dtoTuple[0].path === currImageDef[1];
    });
    if(foundImageDtoTuple === undefined) {
      throw new Error(`attempted to insert JcdProjectImageSort for jcd_image not in db: ${currImageDef[1]}`);
    }
    let jcdProjectImageDto = foundImageDtoTuple[1];
    let jcdProjectImageDtos = await JcdProjectImage.getAllByProject(client, {
      jcd_project_id: opts.jcd_project_id,
    });
    let foundImageDtoIdx = jcdProjectImageDtos.findIndex(projImageDto => {
      return currImageDef[1] === projImageDto.path;
    });
    if(foundImageDtoIdx === -1) {
      let prevSortDef: JcdImageDef | undefined;
      let insertAfterSortDto: JcdProjectImageJoinDtoType | undefined;
      if((prevSortDef = opts.jcdImageDefs[i - 1]) !== undefined) {
        let insertAfterDtoIdx = jcdProjectImageDtos.findIndex(projImage => {
          return prevSortDef?.[1] === projImage.path;
        });
        insertAfterSortDto = jcdProjectImageDtos[insertAfterDtoIdx];
      }
      let insertSortOrder: number;
      if(insertAfterSortDto === undefined) {
        insertSortOrder = 1;
      } else {
        insertSortOrder = insertAfterSortDto.sort_order + 1;
      }
      let insertOutStr = `inserting ${currImageDef[1]} at ${insertSortOrder}`;
      if(insertAfterSortDto !== undefined) {
        insertOutStr += ` after ${insertAfterSortDto.path}`;
      }
      console.log(insertOutStr);
      await JcdProjectImageSort.insert(client, {
        jcd_project_id: opts.jcd_project_id,
        jcd_project_image_id: jcdProjectImageDto.jcd_project_image_id,
        sort_order: insertSortOrder,
      });
    }
  }
}

async function upsertJcdImages(client: DbClient, opts: {
  jcd_project_id: number;
  jcdImageDefs: JcdImageDef[];
}): Promise<[JcdImageDtoType, JcdProjectImageDtoType][]> {
  let jcdProjectImageDtoTuples: [JcdImageDtoType, JcdProjectImageDtoType][] = [];

  for(let i = 0; i < opts.jcdImageDefs.length; ++i) {
    let currImageDef = opts.jcdImageDefs[i];
    let jcdProjectImageDtoTuple = await upsertJcdImage(client, {
      jcd_project_id: opts.jcd_project_id,
      imageDef: currImageDef,
    });
    jcdProjectImageDtoTuples.push(jcdProjectImageDtoTuple);
  }

  return jcdProjectImageDtoTuples;
}

async function upsertJcdImage(client: DbClient, opts: {
  jcd_project_id: number;
  imageDef: JcdImageDef;
}): Promise<[JcdImageDtoType, JcdProjectImageDtoType]> {
  let jcdImageDto = await JcdImage.getByPath(client, {
    path: opts.imageDef[1],
  });
  if(jcdImageDto === undefined) {
    jcdImageDto = await JcdImage.insert(client, {
      path: opts.imageDef[1],
    });
  }
  let jcdImageKind = imageDtoKindFromDef(opts.imageDef);
  let jcdProjectImageDto = await JcdProjectImage.get(client, {
    jcd_project_id: opts.jcd_project_id,
    jcd_image_id: jcdImageDto.jcd_image_id,
    kind: jcdImageKind,
  });
  if(jcdProjectImageDto === undefined) {
    jcdProjectImageDto = await JcdProjectImage.insert(client, {
      jcd_project_id: opts.jcd_project_id,
      jcd_image_id: jcdImageDto.jcd_image_id,
      kind: jcdImageKind,
    });
  }
  return [ jcdImageDto, jcdProjectImageDto ];
}

function imageDtoKindFromDef(def: JcdImageDef): JcdProjectImageDtoType['kind'] {
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
}): Promise<JcdPressDtoType[]> {
  let jcdPressDtos: JcdPressDtoType[] = [];
  let publicationDtos: PublicationDtoType[] = [];
  for(let i = 0; i < opts.jcdProjectDef.press.length; ++i) {
    let currPressDef = opts.jcdProjectDef.press[i];
    let [ publicationDto, jcdPressDto ] = await upsertJcdPressItem(client, {
      jcd_project_id: opts.jcd_project_id,
      pressDef: currPressDef,
    });
    publicationDtos.push(publicationDto);
    jcdPressDtos.push(jcdPressDto);
  }
  /*
    Assert jcd_press relations
   */
  assertJcdPressUpserts(publicationDtos, jcdPressDtos);
  return jcdPressDtos;
}

function assertJcdPressUpserts(
  publicationDtos: PublicationDtoType[],
  jcdPressDtos: JcdPressDtoType[],
) {
  for(let i = 0; i < publicationDtos.length; ++i) {
    let publicationDto = publicationDtos[i];
    let foundJcdPressDto = jcdPressDtos.find(jcdPressDto => {
      return publicationDto.publication_id === jcdPressDto.publication_id;
    });
    assert(foundJcdPressDto !== undefined, `${publicationDto.name}: ${foundJcdPressDto?.link_text}`);
  }
}

async function upsertJcdPressItem(client: DbClient, opts: {
  jcd_project_id: number;
  pressDef: PressDef;
}): Promise<[PublicationDtoType, JcdPressDtoType]> {
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
      description: opts.pressDef.description,
    });
  }
  return [ publicationDto, jcdPressDto ];
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
}): Promise<JcdProducerDtoType[]> {
  let jcdProducerDtos: JcdProducerDtoType[] = [];

  for(let i = 0; i < opts.jcdProjectDef.producer.length; ++i) {
    let currProducerDef = opts.jcdProjectDef.producer[i];
    let jcdProducerDto = await upsertJcdProducer(client, {
      jcd_project_id: opts.jcd_project_id,
      producerDef: currProducerDef,
    });
    jcdProducerDtos.push(jcdProducerDto);
  }

  return jcdProducerDtos;
}

async function upsertJcdProducer(client: DbClient, opts: {
  jcd_project_id: number;
  producerDef: JcdContribDef;
}): Promise<JcdProducerDtoType> {
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
    });
  }
  return jcdProducerDto;
}

async function upsertJcdProdCredits(client: DbClient, opts: {
  jcdProjectDef: JcdProjectDef;
  jcd_project_id: number;
}): Promise<JcdProdCreditDtoType[]> {
  let jcdProdCredits: JcdProdCreditDtoType[] = [];
  for(let i = 0; i < opts.jcdProjectDef.prod_credits.length; ++i) {
    let currCreditDef = opts.jcdProjectDef.prod_credits[i];
    let currCreditDto = await upsertJcdProdCredit(client, {
      jcd_project_id: opts.jcd_project_id,
      creditDef: currCreditDef,
    });
    jcdProdCredits.push(currCreditDto);
  }
  return jcdProdCredits;
}

async function upsertJcdProdCredit(client: DbClient, opts: {
  jcd_project_id: number;
  creditDef: JcdCreditDef;
}): Promise<JcdProdCreditDtoType> {
  let currCreditDto = await JcdProdCredit.upsert(client, {
    jcd_project_id: opts.jcd_project_id,
    jcdCreditDef: opts.creditDef,
  });
  let contribDtos: (PersonDtoType | OrgDtoType)[] = [];
  let creditContribDtos: JcdProdCreditContribDtoType[] = [];
  for(let i  = 0; i < opts.creditDef.contribs.length; ++i) {
    let currContribDef = opts.creditDef.contribs[i];
    let currContribDto = await upsertContrib(client, {
      contribDef: currContribDef,
    });
    contribDtos.push(currContribDto);
    let jcdProdCreditContribDto = await JcdProdCreditContrib.upsert(client, {
      jcdProdCreditDto: currCreditDto,
      jcdContribDto: currContribDto,
    });
    creditContribDtos.push(jcdProdCreditContribDto);
  }
  assertJcdProdCreditUpsert(contribDtos, creditContribDtos, currCreditDto);
  return currCreditDto;
}

function assertJcdProdCreditUpsert(
  contribDtos: (PersonDtoType | OrgDtoType)[],
  jcdProdCreditContribDtos: JcdProdCreditContribDtoType[],
  jcdProdCreditDto: JcdProdCreditDtoType,
) {
  assert(contribDtos.length === jcdProdCreditContribDtos.length);
  contribDtos.forEach(contrib => {
    let foundProdCreditContrib = jcdProdCreditContribDtos.find(prodCreditContrib => {
      if(PersonDto.check(contrib)) {
        return prodCreditContrib.person_id === contrib.person_id;
      }
      if(OrgDto.check(contrib)) {
        return prodCreditContrib.org_id === contrib.org_id;
      }
      return false;
    });
    assert(foundProdCreditContrib !== undefined, `${jcdProdCreditDto.label}: ${contrib.name}`);
  });
}

async function upsertJcdCredits(client: DbClient, opts: {
  jcdProjectDef: JcdProjectDef;
  jcd_project_id: number;
}): Promise<JcdCreditDtoType[]> {
  let jcdCredits: JcdCreditDtoType[] = [];
  for(let i = 0; i < opts.jcdProjectDef.credits.length; ++i) {
    let currCredit = opts.jcdProjectDef.credits[i];
    let currCreditDto = await upsertJcdCredit(client, {
      creditDef: currCredit,
      jcd_project_id: opts.jcd_project_id,
    });
    jcdCredits.push(currCreditDto);
    let contribDtos: (PersonDtoType | OrgDtoType)[] = [];
    let jcdCreditContribDtos: JcdCreditContribDtoType[] = [];
    for(let k = 0; k < currCredit.contribs.length; ++k) {
      let currContrib = currCredit.contribs[k];
      let currContribDto = await upsertContrib(client, {
        contribDef: currContrib,
      });
      contribDtos.push(currContribDto);
      let jcdCreditContribDto = await upsertJcdCreditContrib(client, {
        jcdCreditDto: currCreditDto,
        jcdContribDto: currContribDto,
      });
      jcdCreditContribDtos.push(jcdCreditContribDto);
    }
    assertJcdCreditUpsert(currCreditDto, jcdCreditContribDtos, contribDtos);
  }
  return jcdCredits;
}

function assertJcdCreditUpsert(
  jcdCreditDto: JcdCreditDtoType,
  jcdCreditContribs: JcdCreditContribDtoType[],
  contribDtos: (PersonDtoType | OrgDtoType)[],
) {
  assert(jcdCreditContribs.length === contribDtos.length);
  contribDtos.forEach(contrib => {
    let foundCreditContrib = jcdCreditContribs.find(jcdCreditContrib => {
      if(PersonDto.check(contrib)) {
        return jcdCreditContrib.person_id === contrib.person_id;
      }
      if(OrgDto.check(contrib)) {
        return jcdCreditContrib.org_id === contrib.org_id;
      }
      return false;
    });
    assert(foundCreditContrib !== undefined, `${jcdCreditDto.label}: ${contrib.name}`);
  });
}

async function upsertJcdCreditContrib(client: DbClient, opts: {
  jcdCreditDto: JcdCreditDtoType;
  jcdContribDto: PersonDtoType | OrgDtoType;
}): Promise<JcdCreditContribDtoType> {
  let jcdCreditContribDto = await JcdCreditContrib.get(client, {
    jcd_credit_id: opts.jcdCreditDto.jcd_project_id,
    jcdContribDto: opts.jcdContribDto,
  });
  if(jcdCreditContribDto !== undefined) {
    return jcdCreditContribDto;
  }
  jcdCreditContribDto = await JcdCreditContrib.insert(client, {
    jcd_credit_id: opts.jcdCreditDto.jcd_credit_id,
    jcdContribDto: opts.jcdContribDto,
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
