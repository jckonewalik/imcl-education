import {
  CreateStudentRepository,
  FindStudentRepository,
  UpdateStudentRepository,
} from "@/domain/student/repository";
import {
  SequelizeCreateStudentRepository,
  SequelizeFindStudentRepository,
  SequelizeUpdateStudentRepository,
} from "@/infra/db/sequelize/student/repository";
import { AllExceptionsFilter } from "@/presentation/@shared/filters";
import { StudentsController } from "@/presentation/student/controllers";
import { GetStudentUseCase, RegisterStudentUseCase } from "@/usecases/student";
import { UpdateStudentUseCase } from "@/usecases/student/update-student";
import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";

@Module({
  controllers: [StudentsController],
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
      provide: "CreateStudentRepository",
      useClass: SequelizeCreateStudentRepository,
    },
    {
      provide: "FindStudentRepository",
      useClass: SequelizeFindStudentRepository,
    },
    {
      provide: "UpdateStudentRepository",
      useClass: SequelizeUpdateStudentRepository,
    },
    {
      inject: ["CreateStudentRepository"],
      provide: RegisterStudentUseCase,
      useFactory: (createStudentRepository: CreateStudentRepository) => {
        return new RegisterStudentUseCase(createStudentRepository);
      },
    },
    {
      inject: ["FindStudentRepository", "UpdateStudentRepository"],
      provide: UpdateStudentUseCase,
      useFactory: (
        findStudentRepository: FindStudentRepository,
        updateStudentRepository: UpdateStudentRepository
      ) => {
        return new UpdateStudentUseCase(
          findStudentRepository,
          updateStudentRepository
        );
      },
    },
    {
      inject: ["FindStudentRepository"],
      provide: GetStudentUseCase,
      useFactory: (findStudentRepository: FindStudentRepository) => {
        return new GetStudentUseCase(findStudentRepository);
      },
    },
  ],
})
export class StudentsModule {}
