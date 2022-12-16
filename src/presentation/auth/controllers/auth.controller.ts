import { ApiResponseDto } from "@/presentation/@shared/decorators/api-response-dto";
import { ErrorResponseDto } from "@/presentation/@shared/dto/error-response.dto";
import { ResponseDto } from "@/presentation/@shared/dto/response.dto";
import { RegisterUserUseCase } from "@/usecases/user";
import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateUserDTO, UserDTO } from "../dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(readonly registerUseCase: RegisterUserUseCase) {}

  @Post("/signup")
  @ApiResponseDto(UserDTO, { status: 201 })
  @ApiBadRequestResponse({
    status: 400,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  async signup(
    @Body() dto: CreateUserDTO
  ): Promise<ResponseDto<UserDTO | undefined>> {
    const user = await this.registerUseCase.register(dto);
    return new ResponseDto(HttpStatus.CREATED, UserDTO.fromEntity(user));
  }
}
