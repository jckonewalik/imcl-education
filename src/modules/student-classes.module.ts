import { FindCourseRepository } from "@/domain/course/repository";
import { CreateStudentClassRepository } from "@/domain/student-class/repository";
import { SequelizeCreateStudentClassRepository } from "@/infra/db/sequelize/student-class/repository/create-student-class.repostitory";
import { AllExceptionsFilter } from "@/presentation/@shared/filters";
import { StudentClassesController } from "@/presentation/student-class/controllers";
import { CreateStudentClassUseCase } from "@/usecases/student-class/create-student-class";
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
      inject: ["CreateStudentClassRepository", "FindCourseRepository"],
      provide: CreateStudentClassUseCase,
      useFactory: (
        createRepo: CreateStudentClassRepository,
        findCourseRepo: FindCourseRepository
      ) => {
        return new CreateStudentClassUseCase(createRepo, findCourseRepo);
      },
    },
  ],
})
export class StudentClassesModule {}
