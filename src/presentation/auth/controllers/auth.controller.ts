import { GenerateToken } from "@/infra/protocols";
import { ApiResponseDto } from "@/presentation/@shared/decorators/api-response-dto";
import { ErrorResponseDto } from "@/presentation/@shared/dto/error-response.dto";
import { ResponseDto } from "@/presentation/@shared/dto/response.dto";
import { AuthenticateUseCase } from "@/usecases/auth/authenticate";
import { RegisterUserUseCase } from "@/usecases/user";
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Response } from "express";
import { CreateUserDTO, LoginDTO, UserDTO } from "../dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    readonly registerUseCase: RegisterUserUseCase,
    @Inject("AuthenticateUseCase")
    readonly authUseCase: AuthenticateUseCase,
    @Inject("GenerateToken")
    readonly generateToken: GenerateToken
  ) {}

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

  @Post("/signin")
  @HttpCode(200)
  @ApiResponseDto(UserDTO, { status: 200 })
  @ApiBadRequestResponse({
    status: 400,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  async login(@Body() dto: LoginDTO, @Res() res: Response): Promise<void> {
    const user = await this.authUseCase.auth(dto);
    const token = this.generateToken.generate(dto.login);
    res
      .set({ Authorization: token })
      .status(HttpStatus.OK)
      .json(new ResponseDto(HttpStatus.OK, UserDTO.fromEntity(user)))
      .send();
  }
}
