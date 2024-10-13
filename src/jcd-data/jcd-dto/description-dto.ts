
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const DescriptionDtoSchema = Type.Object({
  description_id: Type.Number(),
  text: Type.String(),

  created_at: Type.Date(),
  last_modified: Type.Date(),
});

type DescriptionDtoType = Static<typeof DescriptionDtoSchema>;

export class DescriptionDto implements DescriptionDtoType {
  constructor(
    public description_id: number,
    public text: string,
    public created_at: Date,
    public last_modified: Date,
  ) {}

  static deserialize(val: unknown): DescriptionDto {
    let parsedDesc = Value.Parse(DescriptionDtoSchema, val);
    let descDto = new DescriptionDto(
      parsedDesc.description_id,
      parsedDesc.text,
      parsedDesc.created_at,
      parsedDesc.last_modified,
    );
    return descDto;
  }
}
