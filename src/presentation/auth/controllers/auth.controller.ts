import { Role } from "@/domain/user/entity/role";
import { ApiResponseDto, Public, Roles } from "@/infra/decorators";
import { GenerateToken } from "@/infra/protocols";
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
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Response } from "express";
import { CreateUserDTO, LoginDTO, UserDTO } from "../dto";
import { ResetPasswordUseCase } from "@/usecases/auth/reset-password";
import { ResetPasswordDTO } from "../dto/reset-password.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    readonly registerUseCase: RegisterUserUseCase,
    @Inject("AuthenticateUseCase")
    readonly authUseCase: AuthenticateUseCase,
    @Inject("GenerateToken")
    readonly generateToken: GenerateToken,
    @Inject("ResetPasswordUseCase")
    readonly resetPasswordUseCase: ResetPasswordUseCase
  ) { }

  @Post("/signup")
  @Roles(Role.ROLE_ADMIN)
  @ApiResponseDto(UserDTO, { status: 201 })
  @ApiBadRequestResponse({
    status: 400,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  @ApiHeader({
    name: "Authorization",
    required: true,
    description: "Bearer token para autenticação",
  })
  async signup(
    @Body() dto: CreateUserDTO
  ): Promise<ResponseDto<UserDTO | undefined>> {
    const user = await this.registerUseCase.register(dto);
    return new ResponseDto(HttpStatus.CREATED, UserDTO.fromEntity(user));
  }

  @Post("/signin")
  @Public()
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
    const token = this.generateToken.generate(user);
    res
      .set({ Authorization: token })
      .status(HttpStatus.OK)
      .json(new ResponseDto(HttpStatus.OK, UserDTO.fromEntity(user)))
      .send();
  }

  @Post("/reset-password")
  @Public()
  @HttpCode(200)
  @ApiResponseDto(String, { status: 200 })
  @ApiBadRequestResponse({
    status: 400,
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    type: ErrorResponseDto,
  })
  async resetPassword(@Body() dto: ResetPasswordDTO, @Res() res: Response): Promise<void> {
    const response = await this.resetPasswordUseCase.execute({ email: dto.login });
    res
      .status(HttpStatus.OK)
      .json({ message: response })
      .send();
  }
}
