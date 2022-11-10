import { ApiProperty } from "@nestjs/swagger";

export class PhoneNumberDto {
  @ApiProperty({
    description: "Telefone do aluno",
    required: false,
  })
  number: string;

  @ApiProperty({
    description: "O telefone é usado como Whatsapp?",
    required: false,
  })
  isWhatsapp: boolean;
}
