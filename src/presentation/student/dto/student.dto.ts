import { Student } from "@/domain/student/entity";
import { ApiProperty } from "@nestjs/swagger";
import { PhoneNumberDto } from "./phone-number.dto";

export class StudentDto {
  @ApiProperty({
    description: "ID do aluno",
  })
  id: string;
  @ApiProperty({
    description: "Nome do aluno",
  })
  name: string;
  @ApiProperty({
    enum: ["F", "M"],
    description: "Gênero do aluno",
  })
  gender: string;
  @ApiProperty({
    description: "Identificação de status ativo do aluno",
  })
  active: boolean;
  @ApiProperty({
    description: "Telefone do aluno",
    required: false,
    type: PhoneNumberDto,
  })
  phone: PhoneNumberDto;

  private constructor() {}

  static fromEntity(entity: Student): StudentDto {
    const dto = new StudentDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.gender = entity.gender;
    dto.active = entity.active;
    return dto;
  }
}
