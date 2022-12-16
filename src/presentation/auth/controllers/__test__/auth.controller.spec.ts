import Messages from "@/domain/@shared/util/messages";
import { UserModel, UserRoleModel } from "@/infra/db/sequelize/user/model";
import { UserModule } from "@/modules/user.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

jest.mock("firebase/auth");
describe("Auth Controller Tests", () => {
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

        await sequelize.addModels([UserModel, UserRoleModel]);
        await sequelize.sync();
      },
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [...databaseProviders],
      imports: [UserModule],
    }).compile();
    (getAuth as jest.Mock).mockResolvedValue({});
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({});
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it(`/POST signup`, async () => {
    const email = faker.internet.email();
    const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const password = faker.internet.password();

    await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        email,
        name,
        password,
        passwordConfirmation: password,
      })
      .expect(201);

    const result = await UserModel.findOne({ where: { email } });
    expect(result).toBeDefined();
    expect(result?.name).toEqual(name);
  });

  it(`/POST signup with bad request`, () => {
    return request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
      })
      .then((result) => {
        expect(result.statusCode).toEqual(400);
        expect(result._body.message).toEqual(Messages.MISSING_PASSWORD);
      });
  });
});
