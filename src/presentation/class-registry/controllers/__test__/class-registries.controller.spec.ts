import {
  ClassRegistryLessonModel,
  ClassRegistryModel,
  ClassRegistryStudentModel,
} from "@/infra/db/sequelize/class-registry/model";
import { makeModels } from "@/infra/db/sequelize/class-registry/repository/__test__/util";
import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import {
  EnrollmentModel,
  StudentClassModel,
  StudentClassTeacherModel,
} from "@/infra/db/sequelize/student-class/model";
import { StudentModel } from "@/infra/db/sequelize/student/model";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import { ClassRegistriesModule } from "@/modules/class-registries.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";

describe("Class Registries Controller Tests", () => {
  let app: INestApplication;

  const databaseProviders = [
    {
      provide: "SEQUELIZE",
      useFactory: async () => {
        const sequelize = new Sequelize({
          dialect: "sqlite",
          storage: ":memory:",
          logging: false,
          sync: { force: true },
        });

        await sequelize.addModels([
          StudentClassModel,
          CourseModel,
          EnrollmentModel,
          StudentClassTeacherModel,
          TeacherModel,
          LessonModel,
          StudentModel,
          ClassRegistryModel,
          ClassRegistryStudentModel,
          ClassRegistryLessonModel,
        ]);
        await sequelize.sync();
      },
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [...databaseProviders],
      imports: [ClassRegistriesModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it(`/POST class-registries`, async () => {
    const { course, student, studentClass, teacher } = await makeModels();
    const response = await request(app.getHttpServer())
      .post("/class-registries")
      .send({
        studentClassId: studentClass.id,
        teacherId: teacher.id,
        date: new Date().toISOString().split("T")[0],
        studentIds: [student.id],
        lessonIds: [course.lessons[0]?.id],
      });

    console.log(response);

    const result = await ClassRegistryModel.findOne({
      include: ["lessons", "students"],
    });
    expect(result).toBeDefined();
    expect(result?.studentClassId).toBe(studentClass.id);
    expect(result?.teacherId).toBe(teacher.id);
    expect(result?.date).toBe(new Date().toISOString().split("T")[0]);
    expect(result?.lessons.length).toBe(1);
    expect(result?.lessons[0].id).toBe(course.lessons[0].id);
    expect(result?.students.length).toBe(1);
    expect(result?.students[0].id).toBe(student.id);
  });
});
