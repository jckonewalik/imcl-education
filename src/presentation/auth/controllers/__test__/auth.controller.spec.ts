import Messages from "@/domain/@shared/util/messages";
import { Role } from "@/domain/user/entity/role";
import { UserModel, UserRoleModel } from "@/infra/db/sequelize/user/model";
import { UserModule } from "@/modules/user.module";
import { makeJwtToken } from "@/__test__/@shared/util";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import faker from "faker";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { v4 as uuid } from "uuid";
import { UserDTO } from "../../dto";

jest.mock("firebase/auth");

const makeUser = async ({
  id = uuid(),
  email = faker.internet.email(),
  name = `${faker.name.firstName()} ${faker.name.lastName()}`,
  active = true,
}) => {
  return await UserModel.create(
    {
      id,
      email,
      name,
      active,
      roles: [
        {
          userId: id,
          role: Role.ROLE_USER,
        },
      ],
    },
    {
      include: ["roles"],
    }
  );
};
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
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({});

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
      .set({
        Authorization: `Bearer ${makeJwtToken({
          roles: [Role.ROLE_ADMIN],
        })}`,
      })
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
      .set({
        Authorization: `Bearer ${makeJwtToken({
          roles: [Role.ROLE_ADMIN],
        })}`,
      })
      .send({
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
      })
      .then((result) => {
        expect(result.statusCode).toEqual(400);
        expect(result._body.message).toEqual(Messages.MISSING_PASSWORD);
      });
  });

  it(`/POST signup with unauthorized user`, () => {
    return request(app.getHttpServer())
      .post("/auth/signup")
      .set({
        Authorization: `Bearer ${makeJwtToken({
          roles: [],
        })}`,
      })
      .send({
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
      })
      .then((result) => {
        expect(result.statusCode).toEqual(403);
        expect(result._body.message).toEqual(Messages.FORBIDDEN_RESOURCE);
      });
  });

  it(`/POST signin`, async () => {
    const login = faker.internet.email();
    const password = faker.internet.password();

    const user = await makeUser({ email: login });

    const result = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        login,
        password,
      });
    expect(result.statusCode).toBe(200);
    const body: UserDTO = result._body.body;
    expect(body).toBeDefined();
    expect(body).not.toBeNull();

    expect(body.email).toBe(login);
    expect(body.name).toBe(user.name);
    expect(body.active).toBe(user.active);
  });
});
