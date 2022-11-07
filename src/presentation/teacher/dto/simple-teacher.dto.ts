import { Teacher } from "@/domain/teacher/entity";
import { ApiProperty } from "@nestjs/swagger";

export class SimpleTeacherDto {
  @ApiProperty({
    description: "ID do professor",
  })
  id: string;
  @ApiProperty({
    description: "Nome do professor",
  })
  name: string;
  @ApiProperty({
    description: "E-mail do professor",
  })
  email: string;
  @ApiProperty({
    description: "Identificação de status ativo do professor",
  })
  active: boolean;

  private constructor() {}

  static fromEntity(entity: Teacher): SimpleTeacherDto {
    const dto = new SimpleTeacherDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.email = entity.email.value;
    dto.active = entity.active;
    return dto;
  }
}
