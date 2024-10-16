
import assert from 'assert';

import { type PoolClient } from 'pg';

import { PostgresClient } from '../../lib/postgres-client';
import { Timer } from '../../util/timer';
import {
  JcdContribDef,
  JcdCreditDef,
  JcdProjectDef,
  JcdV4Projects,
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

export async function jcdDbV4Main() {
  let projects = JcdV4Projects;
  // let projects = JcdV4Projects.slice(0, 5);
  console.log(projects.map(proj => proj.project_key));

  let timer = Timer.start();
  for(let i = 0; i < projects.length; ++i) {
    let currProject = projects[i];
    await upsertProjectDef(currProject);
  }
  await PostgresClient.end();
  let elapsedMs = timer.stop();
  console.log(`upserted ${projects.length} in ${elapsedMs} ms`);
}

async function upsertProjectDef(jcdProjectDef: JcdProjectDef) {
  console.log(jcdProjectDef.project_key);
  await PostgresClient.transact(async (pgClient) => {
    let jcdProjectDto = await upsertProject(pgClient, jcdProjectDef);

    let descDto = await upsertProjectDesc(pgClient, {
      text: jcdProjectDef.description.join('\n'),
      jcd_project_id: jcdProjectDto.jcd_project_id,
    });

    let jcdProjDescDto = await upsertJcdProjectDesc(pgClient, {
      jcd_project_id: jcdProjectDto.jcd_project_id,
      description_id: descDto.description_id,
    });

    console.log(jcdProjectDto.jcd_project_id);
    console.log(jcdProjDescDto.jcd_project_description_id);

    await upsertJcdCredits(pgClient, {
      jcdProjectDef,
      jcd_project_id: jcdProjectDto.jcd_project_id,
    });
    await upsertJcdProdCredits(pgClient, {
      jcdProjectDef,
      jcd_project_id: jcdProjectDto.jcd_project_id,
    });
    await upsertJcdProducers(pgClient, {
      jcdProjectDef,
      jcd_project_id: jcdProjectDto.jcd_project_id,
    });
    await upsertJcdPress(pgClient, {
      jcdProjectDef,
      jcd_project_id: jcdProjectDto.jcd_project_id,
    });
  });
}

async function upsertJcdPress(client: PoolClient, opts: {
  jcdProjectDef: JcdProjectDef;
  jcd_project_id: number;
}): Promise<JcdPressDtoType[]> {
  let jcdPressDtos: JcdPressDtoType[] = [];
  let publicationDtos: PublicationDtoType[] = [];
  for(let i = 0; i < opts.jcdProjectDef.press.length; ++i) {
    let currPressDef = opts.jcdProjectDef.press[i];
    let publicationDto = await Publication.getByName(client, {
      name: currPressDef.publication,
    });
    if(publicationDto === undefined) {
      publicationDto = await Publication.insert(client, {
        name: currPressDef.publication,
      });
    }
    publicationDtos.push(publicationDto);
    let jcdPressDto = await JcdPress.get(client, {
      jcd_project_id: opts.jcd_project_id,
      publication_id: publicationDto.publication_id,
    });
    if(jcdPressDto === undefined) {
      jcdPressDto = await JcdPress.insert(client, {
        jcd_project_id: opts.jcd_project_id,
        publication_id: publicationDto.publication_id,
        link_text: currPressDef.link.label,
        link_url: currPressDef.link.url,
        description: currPressDef.description,
      });
    }
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

async function upsertJcdProducers(client: PoolClient, opts: {
  jcdProjectDef: JcdProjectDef;
  jcd_project_id: number;
}): Promise<JcdProducerDtoType[]> {
  let jcdProducerDtos: JcdProducerDtoType[] = [];

  for(let i = 0; i < opts.jcdProjectDef.producer.length; ++i) {
    let currProducerDef = opts.jcdProjectDef.producer[i];
    let contribDto = await upsertContrib(client, {
      contribDef: currProducerDef,
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
    jcdProducerDtos.push(jcdProducerDto);
  }

  return jcdProducerDtos;
}

async function upsertJcdProdCredits(client: PoolClient, opts: {
  jcdProjectDef: JcdProjectDef;
  jcd_project_id: number;
}): Promise<JcdProdCreditDtoType[]> {
  let jcdProdCredits: JcdProdCreditDtoType[] = [];
  for(let i = 0; i < opts.jcdProjectDef.prod_credits.length; ++i) {
    let currCreditDef = opts.jcdProjectDef.prod_credits[i];
    let currCreditDto = await JcdProdCredit.upsert(client, {
      jcd_project_id: opts.jcd_project_id,
      jcdCreditDef: currCreditDef,
    });
    jcdProdCredits.push(currCreditDto);
    let contribDtos: (PersonDtoType | OrgDtoType)[] = [];
    let jcdProdCreditContribDtos: JcdProdCreditContribDtoType[] = [];
    for(let k = 0; k < currCreditDef.contribs.length; ++k) {
      let currContribDef = currCreditDef.contribs[k];
      let currContribDto = await upsertContrib(client, {
        contribDef: currContribDef,
      });
      contribDtos.push(currContribDto);
      let jcdProdCreditContribDto = await JcdProdCreditContrib.upsert(client, {
        jcdProdCreditDto: currCreditDto,
        jcdContribDto: currContribDto,
      });
      jcdProdCreditContribDtos.push(jcdProdCreditContribDto);
    }
    assertJcdProdCreditUpsert(contribDtos, jcdProdCreditContribDtos, currCreditDto);
  }
  return jcdProdCredits;
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

async function upsertJcdCredits(client: PoolClient, opts: {
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

async function upsertJcdCreditContrib(client: PoolClient, opts: {
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

async function upsertJcdCredit(client: PoolClient, opts: {
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

async function upsertContrib(client: PoolClient, opts: {
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

async function upsertPerson(client: PoolClient, opts: {
  name: string,
}): Promise<PersonDtoType> {
  let personDto = await Person.getByName(client, opts.name);
  if(personDto !== undefined) {
    return personDto;
  }
  personDto = await Person.insert(client, opts);
  return personDto;
}

async function upsertOrg(client: PoolClient, opts: {
  name: string;
}): Promise<OrgDtoType> {
  let orgDto = await Org.getByName(client, opts.name);
  if(orgDto !== undefined) {
    return orgDto;
  }
  orgDto = await Org.insert(client, opts);
  return orgDto;
}

async function upsertJcdProjectDesc(client: PoolClient, opts: {
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

async function upsertProjectDesc(client: PoolClient, opts: {
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

async function upsertProject(client: PoolClient, jcdProjectDef: JcdProjectDef): Promise<JcdProjectDtoType> {
  let jcdProjectDto: JcdProjectDtoType | undefined;
  jcdProjectDto = await JcdProject.getByKey(client, jcdProjectDef.project_key);
  if(jcdProjectDto !== undefined) {
    return jcdProjectDto;
  }
  jcdProjectDto = await JcdProject.insert(client, jcdProjectDef);
  return jcdProjectDto;
}
