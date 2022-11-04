import Messages from "@/domain/@shared/util/messages";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import { TeachersModule } from "@/modules/teachers.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";
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
});
