import {
  CreateCourseRepository,
  FindCourseRepository,
  UpdateCourseRepository,
} from "@/domain/course/repository";
import { SequelizeCreateCourseRepository } from "@/infra/db/sequelize/course/repository/create-course.repository";
import { SequelizeFindAllCoursesRepository } from "@/infra/db/sequelize/course/repository/find-all-courses.repository";
import { SequelizeFindCourseRepository } from "@/infra/db/sequelize/course/repository/find-course.repository";
import { SequelizeUpdateCourseRepository } from "@/infra/db/sequelize/course/repository/update-course.repository";
import { AllExceptionsFilter } from "@/presentation/@shared/filters";
import { CoursesController } from "@/presentation/course/controllers";
import CreateCourseUseCase from "@/usecases/course/create-course";
import { GetCourseUseCase } from "@/usecases/course/get-course";
import { UpdateCourseUseCase } from "@/usecases/course/update-course";
import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";

@Module({
  controllers: [CoursesController],

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
      provide: "CreateCourseRepository",
      useClass: SequelizeCreateCourseRepository,
    },
    {
      provide: "FindCourseRepository",
      useClass: SequelizeFindCourseRepository,
    },
    {
      provide: "UpdateCourseRepository",
      useClass: SequelizeUpdateCourseRepository,
    },
    {
      provide: "FindAllCoursesRepository",
      useClass: SequelizeFindAllCoursesRepository,
    },
    {
      inject: ["CreateCourseRepository"],
      provide: CreateCourseUseCase,
      useFactory: (createCourseRepository: CreateCourseRepository) => {
        return new CreateCourseUseCase(createCourseRepository);
      },
    },
    {
      inject: ["FindCourseRepository", "UpdateCourseRepository"],
      provide: UpdateCourseUseCase,
      useFactory: (
        findCourseRepository: FindCourseRepository,
        updateCourseRepository: UpdateCourseRepository
      ) => {
        return new UpdateCourseUseCase(
          findCourseRepository,
          updateCourseRepository
        );
      },
    },
    {
      inject: ["FindCourseRepository"],
      provide: GetCourseUseCase,
      useFactory: (findCourseRepository: FindCourseRepository) => {
        return new GetCourseUseCase(findCourseRepository);
      },
    },
  ],
})
export class CoursesModule {}
