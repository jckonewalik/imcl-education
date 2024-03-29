import {
  ClassRegistryLessonModel,
  ClassRegistryModel,
  ClassRegistryStudentModel,
} from "@/infra/db/sequelize/class-registry/model";
import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import {
  StudentClassModel,
  StudentClassTeacherModel,
} from "@/infra/db/sequelize/student-class/model";
import { StudentModel } from "@/infra/db/sequelize/student/model";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import { UserModel, UserRoleModel } from "@/infra/db/sequelize/user/model";
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ClassRegistriesModule } from "./class-registries.module";
import { CoursesModule } from "./courses.module";
import { StudentClassesModule } from "./student-classes.module";
import { StudentsModule } from "./students.module";
import { TeachersModule } from "./teachers.module";
import { UserModule } from "./user.module";

const dialectOptions =
  process.env.NODE_ENV === "production"
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: "postgres",
      dialectOptions,
      logging: false,
      host: process.env.DB_SERVER,
      port: +(process.env.DB_PORT || 0),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [
        CourseModel,
        StudentModel,
        LessonModel,
        StudentClassModel,
        StudentClassTeacherModel,
        TeacherModel,
        ClassRegistryModel,
        ClassRegistryStudentModel,
        ClassRegistryLessonModel,
        UserModel,
        UserRoleModel,
      ],
    }),
    TeachersModule,
    CoursesModule,
    StudentsModule,
    StudentClassesModule,
    ClassRegistriesModule,
    UserModule,
  ],
})
export class AppModule {}
