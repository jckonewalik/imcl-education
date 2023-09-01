import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDTO {
  @ApiProperty({
    description: "Login do usuário",
    required: true,
  })
  login: string;
}
