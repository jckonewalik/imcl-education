import {
  CreateTeacherRepository,
  FindTeacherByEmailRepository,
  FindTeacherRepository,
  UpdateTeacherRepository,
} from "@/domain/teacher/repository";
import {
  SequelizeCreateTeacherRepository,
  SequelizeFindTeacherByEmailRepository,
  SequelizeFindTeacherRepository,
  SequelizeUpdateTeacherRepository,
} from "@/infra/db/sequelize/teacher/repository";
import { AllExceptionsFilter } from "@/presentation/@shared/filters";
import { TeachersController } from "@/presentation/teacher/controllers";
import {
  RegisterTeacherUseCase,
  UpdateTeacherUseCase,
} from "@/usecases/teacher";
import { GetTeacherUseCase } from "@/usecases/teacher/get-teacher";
import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";

@Module({
  controllers: [TeachersController],

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
      provide: "FindTeacherByEmailRepository",
      useClass: SequelizeFindTeacherByEmailRepository,
    },
    {
      provide: "CreateTeacherRepository",
      useClass: SequelizeCreateTeacherRepository,
    },
    {
      provide: "FindTeacherRepository",
      useClass: SequelizeFindTeacherRepository,
    },
    {
      provide: "UpdateTeacherRepository",
      useClass: SequelizeUpdateTeacherRepository,
    },
    {
      inject: ["FindTeacherByEmailRepository", "CreateTeacherRepository"],
      provide: RegisterTeacherUseCase,
      useFactory: (
        findTeacherByEmailRepo: FindTeacherByEmailRepository,
        createTeacherRepo: CreateTeacherRepository
      ) => {
        return new RegisterTeacherUseCase(
          createTeacherRepo,
          findTeacherByEmailRepo
        );
      },
    },
    {
      inject: [
        "FindTeacherRepository",
        "FindTeacherByEmailRepository",
        "UpdateTeacherRepository",
      ],
      provide: UpdateTeacherUseCase,
      useFactory: (
        findTeacherRepository: FindTeacherRepository,
        findTeacherByEmailRepository: FindTeacherByEmailRepository,
        updateTeacherRepository: UpdateTeacherRepository
      ) => {
        return new UpdateTeacherUseCase(
          findTeacherRepository,
          findTeacherByEmailRepository,
          updateTeacherRepository
        );
      },
    },
    {
      inject: ["FindTeacherRepository"],
      provide: GetTeacherUseCase,
      useFactory: (findTeacherRepository: FindTeacherRepository) => {
        return new GetTeacherUseCase(findTeacherRepository);
      },
    },
  ],
})
export class TeachersModule {}
