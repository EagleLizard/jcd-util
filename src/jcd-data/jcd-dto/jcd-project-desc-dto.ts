
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/*
  jcd_project_description_id SERIAL PRIMARY KEY,

  jcd_project_id INT references jcd_project(jcd_project_id) NOT NULL,
  description_id INT references description(description_id) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */

const JcdProjectDescDtoSchema = Type.Object({
  jcd_project_description_id: Type.Number(),
  jcd_project_id: Type.Number(),
  description_id: Type.Number(),
  created_at: Type.Date(),
  last_modified: Type.Date(),
});

type JcdProjectDescDtoType = Static<typeof JcdProjectDescDtoSchema>;

export class JcdProjectDescDto implements JcdProjectDescDtoType {
  constructor(
    public jcd_project_description_id: number,
    public jcd_project_id: number,
    public description_id: number,
    public created_at: Date,
    public last_modified: Date,
  ) {}

  static deserialize(val: unknown): JcdProjectDescDto {
    let parsedProjDesc = Value.Parse(JcdProjectDescDtoSchema, val);
    let projDescDto = new JcdProjectDescDto(
      parsedProjDesc.jcd_project_description_id,
      parsedProjDesc.jcd_project_id,
      parsedProjDesc.description_id,
      parsedProjDesc.created_at,
      parsedProjDesc.last_modified,
    );
    return projDescDto;
  }
}
