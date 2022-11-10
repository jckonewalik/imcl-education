import { ApiProperty } from "@nestjs/swagger";
import { PhoneNumberDto } from "./phone-number.dto";

export class UpdateStudentDto {
  @ApiProperty({
    description: "Nome do aluno",
    required: true,
  })
  name: string;
  @ApiProperty({
    description: "Telefone do aluno",
    required: false,
    type: PhoneNumberDto,
  })
  phone: PhoneNumberDto;
  @ApiProperty({
    description: "Identificação de status ativo do aluno",
    required: true,
  })
  active: boolean;
}
