import { ApiProperty } from "@nestjs/swagger";

export class UpdateTeacherDto {
  @ApiProperty({
    description: "Nome do professor",
    required: true,
  })
  name: string;
  @ApiProperty({
    description: "E-mail do professor",
    required: true,
  })
  email: string;
  @ApiProperty({
    description: "Identificação de status ativo do professor",
    required: true,
  })
  active: boolean;
}
