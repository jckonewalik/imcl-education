import {
  DeleteClassRegistryRepository,
  FindClassRegistryRepository,
  FindClassRegitryByDateRepository,
  UpdateClassRegistryRepository,
} from "@/domain/class-registry/repository";
import { FindCourseRepository } from "@/domain/course/repository";
import { FindStudentClassRepository } from "@/domain/student-class/repository";
import { FindStudentRepository } from "@/domain/student/repository";
import { FindTeacherRepository } from "@/domain/teacher/repository";
import {
  SequelizeCreateClassRegistryRepository,
  SequelizeFindClassRegitryByDateRepository,
} from "@/infra/db/sequelize/class-registry/repository";
import { SequelizeDeleteClassRegistryRepository } from "@/infra/db/sequelize/class-registry/repository/delete-class-registry.repository";
import { SequelizeFindClassRegistryRepository } from "@/infra/db/sequelize/class-registry/repository/find-class-registry.repository";
import { SequelizeUpdateClassRegistryRepository } from "@/infra/db/sequelize/class-registry/repository/update-class-registry.repository";
import { AllExceptionsFilter } from "@/presentation/@shared/filters";
import { ClassRegistriesController } from "@/presentation/class-registry/controllers";
import {
  CreateClassRegistryUseCase,
  UpdateClassRegistryUseCase,
} from "@/usecases/class-registry";
import { DeleteClassRegistryUseCase } from "@/usecases/class-registry/delete-class-registry";
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
      provide: "FindClassRegistryRepository",
      useClass: SequelizeFindClassRegistryRepository,
    },
    {
      provide: "UpdateClassRegistryRepository",
      useClass: SequelizeUpdateClassRegistryRepository,
    },
    {
      provide: "DeleteClassRegistryRepository",
      useClass: SequelizeDeleteClassRegistryRepository,
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
    {
      provide: UpdateClassRegistryUseCase,
      inject: [
        "FindClassRegistryRepository",
        "UpdateClassRegistryRepository",
        "FindTeacherRepository",
        "FindStudentRepository",
        "FindStudentClassRepository",
        "FindCourseRepository",
      ],
      useFactory: (
        findRepo: FindClassRegistryRepository,
        updateRepo: UpdateClassRegistryRepository,
        findTeacher: FindTeacherRepository,
        findStudent: FindStudentRepository,
        findStudentClass: FindStudentClassRepository,
        findCourse: FindCourseRepository
      ) => {
        return new UpdateClassRegistryUseCase(
          findRepo,
          updateRepo,
          findTeacher,
          findStudent,
          findStudentClass,
          findCourse
        );
      },
    },
    {
      provide: DeleteClassRegistryUseCase,
      inject: ["FindClassRegistryRepository", "DeleteClassRegistryRepository"],
      useFactory: (
        findRepo: FindClassRegistryRepository,
        deleteRepo: DeleteClassRegistryRepository
      ) => {
        return new DeleteClassRegistryUseCase(findRepo, deleteRepo);
      },
    },
  ],
})
export class ClassRegistriesModule {}
