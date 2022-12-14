import { FindCourseRepository } from "@/domain/course/repository";
import {
  CreateStudentClassRepository,
  DeleteStudentClassRepository,
  FindStudentClassRepository,
  UpdateStudentClassRepository,
} from "@/domain/student-class/repository";
import { FindStudentRepository } from "@/domain/student/repository";
import { FindTeacherRepository } from "@/domain/teacher/repository";
import { SequelizeCreateStudentClassRepository } from "@/infra/db/sequelize/student-class/repository/create-student-class.repostitory";
import { SequelizeDeleteStudentClassRepository } from "@/infra/db/sequelize/student-class/repository/delete-student-class.repository";
import { SequelizeFindAllStudentClassesRepository } from "@/infra/db/sequelize/student-class/repository/find-all-student-classes.repository";
import { SequelizeFindStudentClassRepository } from "@/infra/db/sequelize/student-class/repository/find-student-class.repository";
import { SequelizeUpdateStudentClassRepository } from "@/infra/db/sequelize/student-class/repository/update-student-class.repository";
import { AllExceptionsFilter } from "@/presentation/@shared/filters";
import { StudentClassesController } from "@/presentation/student-class/controllers";
import { GetStudentClassUseCase } from "@/usecases/student-class";
import { CreateStudentClassUseCase } from "@/usecases/student-class/create-student-class";
import { DeleteStudentClassUseCase } from "@/usecases/student-class/delete-student-class";
import { UpdateStudentClassUseCase } from "@/usecases/student-class/update-student-class";
import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { SharedModule } from "./shared.module";

@Module({
  controllers: [StudentClassesController],
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
      provide: "CreateStudentClassRepository",
      useClass: SequelizeCreateStudentClassRepository,
    },
    {
      provide: "UpdateStudentClassRepository",
      useClass: SequelizeUpdateStudentClassRepository,
    },
    {
      provide: "DeleteStudentClassRepository",
      useClass: SequelizeDeleteStudentClassRepository,
    },
    {
      provide: "FindStudentClassRepository",
      useClass: SequelizeFindStudentClassRepository,
    },
    {
      provide: "FindAllStudentClassesRepository",
      useClass: SequelizeFindAllStudentClassesRepository,
    },
    {
      inject: ["CreateStudentClassRepository", "FindCourseRepository"],
      provide: CreateStudentClassUseCase,
      useFactory: (
        createRepo: CreateStudentClassRepository,
        findCourseRepo: FindCourseRepository
      ) => {
        return new CreateStudentClassUseCase(createRepo, findCourseRepo);
      },
    },
    {
      inject: [
        "FindStudentClassRepository",
        "UpdateStudentClassRepository",
        "FindStudentRepository",
        "FindTeacherRepository",
      ],
      provide: UpdateStudentClassUseCase,
      useFactory: (
        findRepo: FindStudentClassRepository,
        updateRepo: UpdateStudentClassRepository,
        findStudentRepo: FindStudentRepository,
        findTeacherRepo: FindTeacherRepository
      ) => {
        return new UpdateStudentClassUseCase(
          findRepo,
          updateRepo,
          findStudentRepo,
          findTeacherRepo
        );
      },
    },
    {
      inject: ["FindStudentClassRepository"],
      provide: GetStudentClassUseCase,
      useFactory: (findRepo: FindStudentClassRepository) => {
        return new GetStudentClassUseCase(findRepo);
      },
    },
    {
      inject: ["FindStudentClassRepository", "DeleteStudentClassRepository"],
      provide: DeleteStudentClassUseCase,
      useFactory: (
        findRepo: FindStudentClassRepository,
        deleteRepo: DeleteStudentClassRepository
      ) => {
        return new DeleteStudentClassUseCase(findRepo, deleteRepo);
      },
    },
  ],
})
export class StudentClassesModule {}
