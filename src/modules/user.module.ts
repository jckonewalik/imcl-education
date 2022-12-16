import {
  CreateUserRepository,
  FindUserRepository,
} from "@/domain/user/repository";
import { SequelizeCreateUserRepository } from "@/infra/db/sequelize/user/repository/create-user-repository";
import { SequelizeFindUserRepository } from "@/infra/db/sequelize/user/repository/find-user-repository";
import { FirebaseCreateCredentialsUseCase } from "@/infra/firebase/auth/create-credentials";
import { AllExceptionsFilter } from "@/presentation/@shared/filters";
import { AuthController } from "@/presentation/auth/controllers";
import { CreateCredentialsUseCase } from "@/usecases/auth";
import { RegisterUserUseCase } from "@/usecases/user";
import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";

@Module({
  controllers: [AuthController],
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
  ],
})
export class UserModule {}
