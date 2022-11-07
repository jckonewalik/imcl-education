import { Teacher } from "@/domain/teacher/entity";
import { ApiProperty } from "@nestjs/swagger";

export class TeacherDto {
  @ApiProperty({
    description: "ID do professor",
  })
  id: string;
  @ApiProperty({
    description: "Nome do professor",
  })
  name: string;
  @ApiProperty({
    enum: ["F", "M"],
    description: "Gênero do professor",
  })
  gender: string;
  @ApiProperty({
    description: "E-mail do professor",
  })
  email: string;
  @ApiProperty({
    description: "Identificação de status ativo do professor",
  })
  active: boolean;

  private constructor() {}

  static fromEntity(entity: Teacher): TeacherDto {
    const dto = new TeacherDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.gender = entity.gender;
    dto.email = entity.email.value;
    dto.active = entity.active;
    return dto;
  }
}
