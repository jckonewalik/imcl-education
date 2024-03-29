import {
  CreateUserRepository,
  FindUserRepository,
} from "@/domain/user/repository";
import { SequelizeCreateUserRepository } from "@/infra/db/sequelize/user/repository/create-user-repository";
import { SequelizeFindUserRepository } from "@/infra/db/sequelize/user/repository/find-user-repository";
import { FirebaseAuthenticateUseCase } from "@/infra/firebase/auth/authenticate";
import { FirebaseResetPasswordUseCase } from "@/infra/firebase/auth/reset-password";
import { FirebaseCreateCredentialsUseCase } from "@/infra/firebase/auth/create-credentials";
import { JwtTokenImpl } from "@/infra/jwt/token-impl";
import { AllExceptionsFilter } from "@/presentation/@shared/filters";
import { AuthController } from "@/presentation/auth/controllers";
import { CreateCredentialsUseCase } from "@/usecases/auth";
import {
  GetUserUseCase,
  GetUserUseCaseImpl,
  RegisterUserUseCase,
} from "@/usecases/user";
import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { AuthModule } from "./auth.module";

@Module({
  controllers: [AuthController],
  imports: [AuthModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: "FindUserRepository",
      useClass: SequelizeFindUserRepository,
    },
    {
      provide: "CreateCredentialsUseCase",
      useClass: FirebaseCreateCredentialsUseCase,
    },
    {
      provide: "CreateUserRepository",
      useClass: SequelizeCreateUserRepository,
    },
    {
      provide: "GenerateToken",
      useClass: JwtTokenImpl,
    },
    {
      provide: "ValidateToken",
      useClass: JwtTokenImpl,
    },
    {
      inject: [
        "FindUserRepository",
        "CreateCredentialsUseCase",
        "CreateUserRepository",
      ],
      provide: RegisterUserUseCase,
      useFactory: (
        findRepo: FindUserRepository,
        createCredentials: CreateCredentialsUseCase,
        createUser: CreateUserRepository
      ) => {
        return new RegisterUserUseCase(findRepo, createCredentials, createUser);
      },
    },
    {
      inject: ["FindUserRepository"],
      provide: "GetUserUseCase",
      useFactory: (findRepo: FindUserRepository) => {
        return new GetUserUseCaseImpl(findRepo);
      },
    },
    {
      inject: ["GetUserUseCase"],
      provide: "AuthenticateUseCase",
      useFactory: (getUseCase: GetUserUseCase) => {
        return new FirebaseAuthenticateUseCase(getUseCase);
      },
    },
    {
      provide: "ResetPasswordUseCase",
      useClass: FirebaseResetPasswordUseCase,
    }
  ],
})
export class UserModule { }
