import { SequelizeFindCourseRepository } from "@/infra/db/sequelize/course/repository/find-course.repository";
import { SequelizeFindInCoursesRepository } from "@/infra/db/sequelize/course/repository/find-in-courses.repository";
import { SequelizeFindStudentClassRepository } from "@/infra/db/sequelize/student-class/repository/find-student-class.repository";
import {
  SequelizeFindInStudentsRepository,
  SequelizeFindStudentRepository,
} from "@/infra/db/sequelize/student/repository";
import {
  SequelizeFindInTeachersRepository,
  SequelizeFindTeacherRepository,
} from "@/infra/db/sequelize/teacher/repository";
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
      provide: "FindInStudentsRepository",
      useClass: SequelizeFindInStudentsRepository,
    },
    {
      provide: "FindInCoursesRepository",
      useClass: SequelizeFindInCoursesRepository,
    },
    {
      provide: "FindStudentClassRepository",
      useClass: SequelizeFindStudentClassRepository,
    },
  ],
  exports: [
    "FindCourseRepository",
    "FindStudentRepository",
    "FindTeacherRepository",
    "FindInTeachersRepository",
    "FindInStudentsRepository",
    "FindInCoursesRepository",
    "FindStudentClassRepository",
  ],
})
export class SharedModule {}
