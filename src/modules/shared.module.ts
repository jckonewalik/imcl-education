import { FindCourseRepository } from "@/domain/course/repository";
import { SequelizeFindCourseRepository } from "@/infra/db/sequelize/course/repository/find-course.repository";
import { SequelizeFindStudentRepository } from "@/infra/db/sequelize/student/repository";
import { SequelizeFindTeacherRepository } from "@/infra/db/sequelize/teacher/repository";
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
  ],
})
export class SharedModule {}
