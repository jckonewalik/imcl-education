import {
  CreateTeacherRepository,
  FindTeacherByEmailRepository,
} from "@/domain/teacher/repository";
import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import {
  EnrollmentModel,
  StudentClassModel,
  StudentClassTeacherModel,
} from "@/infra/db/sequelize/student-class/model";
import { StudentModel } from "@/infra/db/sequelize/student/model";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import {
  SequelizeCreateTeacherRepository,
  SequelizeFindTeacherByEmailRepository,
} from "@/infra/db/sequelize/teacher/repository";
import { TeachersController } from "@/presentation/teacher/controllers";
import { RegisterTeacherUseCase } from "@/usecases/teacher";
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 0),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [
        CourseModel,
        StudentModel,
        LessonModel,
        EnrollmentModel,
        StudentClassModel,
        StudentClassTeacherModel,
        TeacherModel,
      ],
    }),
  ],
  controllers: [TeachersController],
  providers: [
    {
      provide: "FindTeacherByEmailRepository",
      useClass: SequelizeFindTeacherByEmailRepository,
    },
    {
      provide: "CreateTeacherRepository",
      useClass: SequelizeCreateTeacherRepository,
    },
    {
      inject: ["FindTeacherByEmailRepository", "CreateTeacherRepository"],
      provide: RegisterTeacherUseCase,
      useFactory: (
        findTeacherByEmailRepo: FindTeacherByEmailRepository,
        createTeacherRepo: CreateTeacherRepository
      ) => {
        return new RegisterTeacherUseCase(
          createTeacherRepo,
          findTeacherByEmailRepo
        );
      },
    },
  ],
})
export class AppModule {}
