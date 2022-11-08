import Messages from "@/domain/@shared/util/messages";
import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import { CoursesModule } from "@/modules/courses.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { v4 as uuid } from "uuid";
describe("Courses Controller Tests", () => {
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

        await sequelize.addModels([CourseModel, LessonModel]);
        await sequelize.sync();
      },
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [...databaseProviders],
      imports: [CoursesModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it(`/POST courses`, async () => {
    const name = faker.random.word();
    await request(app.getHttpServer())
      .post("/courses")
      .send({
        name,
      })
      .expect(201);

    const result = await CourseModel.findAll();
    expect(result).toBeDefined();
    expect(result?.length).toBe(1);
    expect(result?.[0].name).toBe(name);
  });

  it(`/POST courses with bad request`, () => {
    return request(app.getHttpServer())
      .post("/courses")
      .send({})
      .then((result) => {
        expect(result.statusCode).toEqual(400);
        expect(result._body.message).toEqual(Messages.MISSING_COURSE_NAME);
      });
  });

  it(`/PUT courses`, async () => {
    const course = await CourseModel.create({
      id: uuid(),
      name: faker.random.word(),
      active: true,
    });
    const newName = faker.random.word();
    await request(app.getHttpServer())
      .put(`/courses/${course.id}`)
      .send({
        name: newName,
        active: true,
        lessons: [
          {
            number: 1,
            name: faker.random.word(),
            action: "A",
          },
        ],
      })
      .expect(200);

    const result = await CourseModel.findOne({
      where: { id: course.id },
      include: "lessons",
    });
    expect(result).toBeDefined();
    expect(result?.name).toBe(newName);
    expect(result?.lessons.length).toBe(1);
  });

  it(`/PUT courses with invalid course`, async () => {
    await request(app.getHttpServer())
      .put(`/courses/${uuid()}`)
      .send({
        name: faker.random.word(),
        active: false,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(404);
        expect(result._body.message).toEqual(Messages.INVALID_COURSE);
      });
  });

  it(`/GET courses by ID`, async () => {
    const course = await CourseModel.create({
      id: uuid(),
      name: faker.random.word(),
      active: true,
    });
    await request(app.getHttpServer())
      .get(`/courses/${course.id}`)
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result._body.body.id).toEqual(course.id);
      });
  });

  it(`/POST courses/search`, async () => {
    const course1 = await CourseModel.create({
      id: uuid(),
      name: faker.random.word(),
      active: true,
    });
    await CourseModel.create({
      id: uuid(),
      name: faker.random.word(),
      active: true,
    });

    await request(app.getHttpServer())
      .post("/courses/search")
      .send({
        name: course1.name,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result._body?.body?.data?.length).toEqual(1);
        expect(result._body.body.data[0]?.id).toEqual(course1.id);
      });
  });
});
