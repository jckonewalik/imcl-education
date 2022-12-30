import {
  CreateStudentRepository,
  DeleteStudentRepository,
  FindStudentRepository,
  UpdateStudentRepository,
} from "@/domain/student/repository";
import {
  SequelizeCreateStudentRepository,
  SequelizeDeleteStudentRepository,
  SequelizeUpdateStudentRepository,
} from "@/infra/db/sequelize/student/repository";
import { SequelizeFindAllStudentsRepository } from "@/infra/db/sequelize/student/repository/find-all-students.repository";
import { AllExceptionsFilter } from "@/presentation/@shared/filters";
import { StudentsController } from "@/presentation/student/controllers";
import {
  DeleteStudentUseCase,
  GetStudentUseCase,
  RegisterStudentUseCase,
} from "@/usecases/student";
import { UpdateStudentUseCase } from "@/usecases/student/update-student";
import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { SharedModule } from "./shared.module";

@Module({
  controllers: [StudentsController],
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
      provide: "CreateStudentRepository",
      useClass: SequelizeCreateStudentRepository,
    },
    {
      provide: "UpdateStudentRepository",
      useClass: SequelizeUpdateStudentRepository,
    },
    {
      provide: "FindAllStudentsRepository",
      useClass: SequelizeFindAllStudentsRepository,
    },
    {
      provide: "DeleteStudentRepository",
      useClass: SequelizeDeleteStudentRepository,
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
    {
      inject: ["FindStudentRepository", "DeleteStudentRepository"],
      provide: DeleteStudentUseCase,
      useFactory: (
        findStudentRepository: FindStudentRepository,
        deleteStudentRepository: DeleteStudentRepository
      ) => {
        return new DeleteStudentUseCase(
          findStudentRepository,
          deleteStudentRepository
        );
      },
    },
  ],
})
export class StudentsModule {}
