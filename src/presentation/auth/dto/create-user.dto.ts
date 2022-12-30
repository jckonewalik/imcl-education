import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDTO {
  @ApiProperty({
    description: "Nome do usuário",
    required: true,
  })
  name: string;
  @ApiProperty({
    description: "E-mail do usuário",
    required: true,
  })
  email: string;
  @ApiProperty({
    description: "Senha do usuário",
    required: true,
  })
  password: string;
  @ApiProperty({
    description: "Confirmaçao de senha",
    required: true,
  })
  passwordConfirmation: string;
}
