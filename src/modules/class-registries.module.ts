import { FindClassRegitryByDateRepository } from "@/domain/class-registry/repository";
import { FindCourseRepository } from "@/domain/course/repository";
import { FindStudentClassRepository } from "@/domain/student-class/repository";
import { FindTeacherRepository } from "@/domain/teacher/repository";
import {
  SequelizeCreateClassRegistryRepository,
  SequelizeFindClassRegitryByDateRepository,
} from "@/infra/db/sequelize/class-registry/repository";
import { AllExceptionsFilter } from "@/presentation/@shared/filters";
import { ClassRegistriesController } from "@/presentation/class-registry/controllers";
import { CreateClassRegistryUseCase } from "@/usecases/class-registry";
import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { SharedModule } from "./shared.module";

@Module({
  controllers: [ClassRegistriesController],
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
      provide: "FindClassRegitryByDateRepository",
      useClass: SequelizeFindClassRegitryByDateRepository,
    },
    {
      provide: "CreateClassRegistryRepository",
      useClass: SequelizeCreateClassRegistryRepository,
    },
    {
      provide: CreateClassRegistryUseCase,
      inject: [
        "FindClassRegitryByDateRepository",
        "FindStudentClassRepository",
        "FindTeacherRepository",
        "FindCourseRepository",
        "CreateClassRegistryRepository",
      ],
      useFactory: (
        findRepo: FindClassRegitryByDateRepository,
        findStudentClassRepo: FindStudentClassRepository,
        findTeacherRepo: FindTeacherRepository,
        findCourseRepo: FindCourseRepository,
        createRepo
      ) => {
        return new CreateClassRegistryUseCase(
          findRepo,
          findStudentClassRepo,
          findTeacherRepo,
          findCourseRepo,
          createRepo
        );
      },
    },
  ],
})
export class ClassRegistriesModule {}
