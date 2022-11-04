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
import { TeachersController } from "@/presentation/teacher/controllers";
import {
  RegisterTeacherUseCase,
  UpdateTeacherUseCase,
} from "@/usecases/teacher";
import { Module } from "@nestjs/common";

@Module({
  controllers: [TeachersController],
  providers: [
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
  ],
})
export class TeachersModule {}
