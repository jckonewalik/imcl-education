import {
  CreateTeacherRepository,
  DeleteTeacherRepository,
  FindTeacherByEmailRepository,
  FindTeacherRepository,
  UpdateTeacherRepository,
} from "@/domain/teacher/repository";
import {
  SequelizeCreateTeacherRepository,
  SequelizeFindAllTeachersRepository,
  SequelizeFindTeacherByEmailRepository,
  SequelizeUpdateTeacherRepository,
} from "@/infra/db/sequelize/teacher/repository";
import { SequelizeDeleteTeacherRepository } from "@/infra/db/sequelize/teacher/repository/delete-teacher.repository";
import { AllExceptionsFilter } from "@/presentation/@shared/filters";
import { TeachersController } from "@/presentation/teacher/controllers";
import {
  RegisterTeacherUseCase,
  UpdateTeacherUseCase,
} from "@/usecases/teacher";
import { DeleteTeacherUseCase } from "@/usecases/teacher/delete-teacher";
import { GetTeacherUseCase } from "@/usecases/teacher/get-teacher";
import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { SharedModule } from "./shared.module";

@Module({
  controllers: [TeachersController],
  imports: [SharedModule, AuthModule],
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
      provide: "UpdateTeacherRepository",
      useClass: SequelizeUpdateTeacherRepository,
    },
    {
      provide: "FindAllTeachersRepository",
      useClass: SequelizeFindAllTeachersRepository,
    },
    {
      provide: "DeleteTeacherRepository",
      useClass: SequelizeDeleteTeacherRepository,
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
    {
      inject: ["FindTeacherRepository", "DeleteTeacherRepository"],
      provide: DeleteTeacherUseCase,
      useFactory: (
        findTeacherRepository: FindTeacherRepository,
        deleteTeacherRepository: DeleteTeacherRepository
      ) => {
        return new DeleteTeacherUseCase(
          findTeacherRepository,
          deleteTeacherRepository
        );
      },
    },
  ],
})
export class TeachersModule {}
