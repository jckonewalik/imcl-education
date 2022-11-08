import { Course } from "@/domain/course/entity";
import { ApiProperty } from "@nestjs/swagger";

export class SimpleCourseDto {
  @ApiProperty({
    description: "ID do curso",
  })
  id: string;
  @ApiProperty({
    description: "Nome do curso",
  })
  name: string;
  @ApiProperty({
    description: "Identificação de status ativo do curso",
  })
  active: boolean;

  private constructor() {}

  static fromEntity(entity: Course): SimpleCourseDto {
    const dto = new SimpleCourseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.active = entity.active;
    return dto;
  }
}
