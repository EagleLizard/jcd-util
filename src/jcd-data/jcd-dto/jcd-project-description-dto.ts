
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  jcd_project_description_id SERIAL PRIMARY KEY,

  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  description_id INT references description(description_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

const JcdProjectDescriptionDtoSchema = Type.Object({
  jcd_project_description_id: Type.Number(),
  jcd_project_id: Type.Number(),
  description_id: Type.Number(),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

type JcdProjectDescriptionDtoType = Static<typeof JcdProjectDescriptionDtoSchema>;

export class JcdProjectDescriptionDto implements JcdProjectDescriptionDtoType {
  constructor(
    public jcd_project_description_id: number,
    public jcd_project_id: number,
    public description_id: number,
    public created_at: Date,
    public last_modified: Date,
  ) {}

  static deserialize(val: unknown): JcdProjectDescriptionDto {
    let parsedProjDesc = Value.Parse(JcdProjectDescriptionDtoSchema, val);
    let projDescDto = new JcdProjectDescriptionDto(
      parsedProjDesc.jcd_project_description_id,
      parsedProjDesc.jcd_project_id,
      parsedProjDesc.description_id,
      parsedProjDesc.created_at,
      parsedProjDesc.last_modified,
    );
    return projDescDto;
  }
}
