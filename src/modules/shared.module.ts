import { FindCourseRepository } from "@/domain/course/repository";
import { SequelizeFindCourseRepository } from "@/infra/db/sequelize/course/repository/find-course.repository";
import {
  SequelizeFindInStudentsRepository,
  SequelizeFindStudentRepository,
} from "@/infra/db/sequelize/student/repository";
import {
  SequelizeFindInTeachersRepository,
  SequelizeFindTeacherRepository,
} from "@/infra/db/sequelize/teacher/repository";
import { GetCourseUseCase } from "@/usecases/course/get-course";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    {
      provide: "FindCourseRepository",
      useClass: SequelizeFindCourseRepository,
    },
    {
      provide: "FindStudentRepository",
      useClass: SequelizeFindStudentRepository,
    },
    {
      provide: "FindTeacherRepository",
      useClass: SequelizeFindTeacherRepository,
    },
    {
      provide: "FindInTeachersRepository",
      useClass: SequelizeFindInTeachersRepository,
    },
    {
      provide: "FindInStudentsRepository",
      useClass: SequelizeFindInStudentsRepository,
    },
    {
      inject: ["FindCourseRepository"],
      provide: GetCourseUseCase,
      useFactory: (findCourseRepository: FindCourseRepository) => {
        return new GetCourseUseCase(findCourseRepository);
      },
    },
  ],
  exports: [
    "FindCourseRepository",
    GetCourseUseCase,
    "FindStudentRepository",
    "FindTeacherRepository",
    "FindInTeachersRepository",
    "FindInStudentsRepository",
  ],
})
export class SharedModule {}
