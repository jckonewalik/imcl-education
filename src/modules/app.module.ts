import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import {
  EnrollmentModel,
  StudentClassModel,
  StudentClassTeacherModel,
} from "@/infra/db/sequelize/student-class/model";
import { StudentModel } from "@/infra/db/sequelize/student/model";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { TeachersModule } from "./teachers.module";
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: "postgres",
      logging: false,
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
    TeachersModule,
  ],
})
export class AppModule {}
