import { HttpStatus } from "@nestjs/common";

export class ResponseDto<T> {
  constructor(
    private readonly statusCode: HttpStatus,
    private readonly body: T
  ) {}
}
