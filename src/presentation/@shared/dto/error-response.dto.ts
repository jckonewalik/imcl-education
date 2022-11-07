import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponseDto {
  @ApiProperty({
    description: "Código HTTP da resposta",
  })
  private statusCode: HttpStatus;
  @ApiProperty({
    description: "Data da requisição",
  })
  private timestamp: string;
  @ApiProperty({
    description: "Caminho da requisição",
  })
  private path: string;
  @ApiProperty({
    description: "Mensagem de erro",
  })
  private mensagem: string;
}
