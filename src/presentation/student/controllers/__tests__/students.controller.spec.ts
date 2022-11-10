import Messages from "@/domain/@shared/util/messages";
import { StudentModel } from "@/infra/db/sequelize/student/model";
import { StudentsModule } from "@/modules/students.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";
describe("Students Controller Tests", () => {
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

        await sequelize.addModels([StudentModel]);
        await sequelize.sync();
      },
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [...databaseProviders],
      imports: [StudentsModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it(`/POST students`, async () => {
    const name = faker.random.word();
    await request(app.getHttpServer())
      .post("/students")
      .send({
        name,
        gender: "M",
      })
      .expect(201);

    const result = await StudentModel.findAll();
    expect(result).toBeDefined();
    expect(result?.length).toBe(1);
    expect(result?.[0].name).toBe(name);
  });

  it(`/POST students with bad request`, () => {
    const name = faker.random.word();
    return request(app.getHttpServer())
      .post("/students")
      .send({
        name,
        gender: "X",
      })
      .then((result) => {
        expect(result.statusCode).toEqual(400);
        expect(result._body.message).toEqual(Messages.INVALID_GENDER);
      });
  });
});
