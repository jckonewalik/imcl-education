import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ResponseDto<T> {
  @ApiProperty({
    description: "Código HTTP da resposta",
  })
  private statusCode: HttpStatus;
  @ApiProperty({
    description: "Corpo da resposta",
  })
  private body: T;
  constructor(statusCode: HttpStatus, body: T) {
    this.statusCode = statusCode;
    this.body = body;
  }
}
