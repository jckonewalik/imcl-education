import { Lesson } from "@/domain/course/entity";
import { ApiProperty } from "@nestjs/swagger";

export class LessonDto {
  @ApiProperty({
    description: "ID da lição",
  })
  id: string;
  @ApiProperty({
    description: "Número da licão",
  })
  number: number;
  @ApiProperty({
    description: "Nome do licão",
  })
  name: string;
  @ApiProperty({
    description: "Identificação de status ativo da lição",
  })
  active: boolean;

  private constructor() {}

  static fromEntity(entity: Lesson): LessonDto {
    const dto = new LessonDto();
    dto.id = entity.id;
    dto.number = entity.number;
    dto.name = entity.name;
    dto.active = entity.active;
    return dto;
  }
}
