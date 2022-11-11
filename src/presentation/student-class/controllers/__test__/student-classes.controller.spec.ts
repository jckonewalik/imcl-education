import Messages from "@/domain/@shared/util/messages";
import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import {
  EnrollmentModel,
  StudentClassModel,
  StudentClassTeacherModel,
} from "@/infra/db/sequelize/student-class/model";
import { StudentModel } from "@/infra/db/sequelize/student/model";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import { StudentClassesModule } from "@/modules/student-classes.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { v4 as uuid } from "uuid";
const createCourse = async (): Promise<CourseModel> => {
  const course = await CourseModel.create({
    id: uuid(),
    name: faker.random.word(),
    active: true,
  });
  return course;
};

describe("Student Classes Controller Tests", () => {
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
          CourseModel,
          LessonModel,
          StudentClassModel,
          EnrollmentModel,
          StudentClassTeacherModel,
          TeacherModel,
          StudentModel,
        ]);
        await sequelize.sync();
      },
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [...databaseProviders],
      imports: [StudentClassesModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it(`/POST student-classes`, async () => {
    const course = await createCourse();
    const name = faker.random.word();
    await request(app.getHttpServer())
      .post("/student-classes")
      .send({
        courseId: course.id,
        name,
      })
      .expect(201);

    const result = await StudentClassModel.findAll();
    expect(result).toBeDefined();
    expect(result?.length).toBe(1);
    expect(result?.[0].name).toBe(name);
  });

  it(`/POST student-classes with bad request`, () => {
    return request(app.getHttpServer())
      .post("/student-classes")
      .send({
        name: faker.random.word(),
      })
      .then((result) => {
        expect(result.statusCode).toEqual(400);
        expect(result._body.message).toEqual(Messages.MISSING_COURSE_ID);
      });
  });
});
