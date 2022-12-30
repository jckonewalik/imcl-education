import { ApiProperty } from "@nestjs/swagger";

export class LoginDTO {
  @ApiProperty({
    description: "Login do usuário",
    required: true,
  })
  login: string;
  @ApiProperty({
    description: "Senha do usuário",
    required: true,
  })
  password: string;
}
