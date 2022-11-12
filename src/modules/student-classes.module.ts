import { FindCourseRepository } from "@/domain/course/repository";
import {
  CreateStudentClassRepository,
  FindStudentClassRepository,
  UpdateStudentClassRepository,
} from "@/domain/student-class/repository";
import { FindStudentRepository } from "@/domain/student/repository";
import { FindTeacherRepository } from "@/domain/teacher/repository";
import { SequelizeCreateStudentClassRepository } from "@/infra/db/sequelize/student-class/repository/create-student-class.repostitory";
import { SequelizeFindStudentClassRepository } from "@/infra/db/sequelize/student-class/repository/find-student-class.repository";
import { SequelizeUpdateStudentClassRepository } from "@/infra/db/sequelize/student-class/repository/update-student-class.repository";
import { AllExceptionsFilter } from "@/presentation/@shared/filters";
import { StudentClassesController } from "@/presentation/student-class/controllers";
import { CreateStudentClassUseCase } from "@/usecases/student-class/create-student-class";
import { UpdateStudentClassUseCase } from "@/usecases/student-class/update-student-class";
import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { SharedModule } from "./shared.module";

@Module({
  controllers: [StudentClassesController],
  imports: [SharedModule],
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
      provide: "FindStudentClassRepository",
      useClass: SequelizeFindStudentClassRepository,
    },
    {
      provide: "UpdateStudentClassRepository",
      useClass: SequelizeUpdateStudentClassRepository,
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
  ],
})
export class StudentClassesModule {}
