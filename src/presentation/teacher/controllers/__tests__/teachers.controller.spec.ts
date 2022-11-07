import { Gender } from "@/domain/@shared/enums/gender";
import Messages from "@/domain/@shared/util/messages";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import { TeachersModule } from "@/modules/teachers.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { v4 as uuid } from "uuid";
describe("Teachers Controller Tests", () => {
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

        await sequelize.addModels([TeacherModel]);
        await sequelize.sync();
      },
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [...databaseProviders],
      imports: [TeachersModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it(`/POST teachers`, async () => {
    const email = faker.internet.email();
    const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    await request(app.getHttpServer())
      .post("/teachers")
      .send({
        name,
        gender: "M",
        email,
      })
      .expect(201);

    const result = await TeacherModel.findOne({ where: { email } });
    expect(result).toBeDefined();
    expect(result?.name).toEqual(name);
  });

  it(`/POST teachers with bad request`, () => {
    return request(app.getHttpServer())
      .post("/teachers")
      .send({
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
      })
      .then((result) => {
        expect(result.statusCode).toEqual(400);
        expect(result._body.message).toEqual(Messages.INVALID_GENDER);
      });
  });

  it(`/PUT teachers`, async () => {
    const teacher = await TeacherModel.create({
      id: uuid(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      gender: Gender.M.toString(),
      email: faker.internet.email(),
      active: true,
    });
    await request(app.getHttpServer())
      .put(`/teachers/${teacher.id}`)
      .send({
        name: teacher.name,
        email: teacher.email,
        active: false,
      })
      .expect(200);

    const result = await TeacherModel.findOne({ where: { id: teacher.id } });
    expect(result).toBeDefined();
    expect(result?.active).toBeFalsy();
  });

  it(`/PUT teachers with invalid teacher`, async () => {
    await request(app.getHttpServer())
      .put(`/teachers/${uuid()}`)
      .send({
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        active: false,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(404);
        expect(result._body.message).toEqual(Messages.INVALID_TEACHER);
      });
  });

  it(`/GET teachers by ID`, async () => {
    const teacher = await TeacherModel.create({
      id: uuid(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      gender: Gender.M.toString(),
      email: faker.internet.email(),
      active: true,
    });
    await request(app.getHttpServer())
      .get(`/teachers/${teacher.id}`)
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result._body.body.id).toEqual(teacher.id);
      });
  });

  it(`/POST teachers`, async () => {
    const teacher1 = await TeacherModel.create({
      id: uuid(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      gender: Gender.M.toString(),
      email: faker.internet.email(),
      active: true,
    });
    const teacher2 = await TeacherModel.create({
      id: uuid(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      gender: Gender.M.toString(),
      email: faker.internet.email(),
      active: true,
    });

    await request(app.getHttpServer())
      .post("/teachers/search")
      .send({
        name: teacher1.name,
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result._body?.body?.data?.length).toEqual(1);
        expect(result._body.body.data[0]?.id).toEqual(teacher1.id);
      });
  });
});
