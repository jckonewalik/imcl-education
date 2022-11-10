import { CreateStudentRepository } from "@/domain/student/repository";
import { SequelizeCreateStudentRepository } from "@/infra/db/sequelize/student/repository";
import { AllExceptionsFilter } from "@/presentation/@shared/filters";
import { StudentsController } from "@/presentation/student/controllers";
import { RegisterStudentUseCase } from "@/usecases/student";
import { Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";

@Module({
  controllers: [StudentsController],
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
      provide: "CreateStudentRepository",
      useClass: SequelizeCreateStudentRepository,
    },
    {
      inject: ["CreateStudentRepository"],
      provide: RegisterStudentUseCase,
      useFactory: (createStudentRepository: CreateStudentRepository) => {
        return new RegisterStudentUseCase(createStudentRepository);
      },
    },
  ],
})
export class StudentsModule {}
