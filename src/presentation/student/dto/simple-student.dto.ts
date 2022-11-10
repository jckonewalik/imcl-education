import { Student } from "@/domain/student/entity";
import { ApiProperty } from "@nestjs/swagger";

export class SimpleStudentDto {
  @ApiProperty({
    description: "ID do aluno",
  })
  id: string;
  @ApiProperty({
    description: "Nome do aluno",
  })
  name: string;
  @ApiProperty({
    description: "Identificação de status ativo do aluno",
  })
  active: boolean;

  private constructor() {}

  static fromEntity(entity: Student): SimpleStudentDto {
    const dto = new SimpleStudentDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.active = entity.active;
    return dto;
  }
}
