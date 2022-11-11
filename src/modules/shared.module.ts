import { FindCourseRepository } from "@/domain/course/repository";
import { SequelizeFindCourseRepository } from "@/infra/db/sequelize/course/repository/find-course.repository";
import { GetCourseUseCase } from "@/usecases/course/get-course";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    {
      provide: "FindCourseRepository",
      useClass: SequelizeFindCourseRepository,
    },
    {
      inject: ["FindCourseRepository"],
      provide: GetCourseUseCase,
      useFactory: (findCourseRepository: FindCourseRepository) => {
        return new GetCourseUseCase(findCourseRepository);
      },
    },
  ],
  exports: ["FindCourseRepository", GetCourseUseCase],
})
export class SharedModule {}
