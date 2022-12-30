import { Email } from "@/domain/@shared/value-objects";
import { Role } from "@/domain/user/entity/role";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import { UserModel, UserRoleModel } from "../../model";
import { SequelizeFindUserRepository } from "../find-user-repository";
const makeUser = async (
  {
    id = uuid(),
    email = faker.internet.email(),
    name = `${faker.name.firstName()} ${faker.name.lastName()}`,
  },
  active = true
) => {
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
describe("Sequelize Find User Repository", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([UserModel, UserRoleModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Find user", async () => {
    const user = await makeUser({});

    const repository = new SequelizeFindUserRepository();
    const email = new Email(user.email);
    const foundUser = await repository.find(email);

    expect(foundUser).toBeDefined();
    expect(foundUser?.name).toBe(user.name);
    expect(foundUser?.id).toBe(user.id);
    expect(foundUser?.email).toStrictEqual(email);
    expect(foundUser?.active).toBe(user.active);
    expect(foundUser?.roles.length).toBe(1);
    expect(foundUser?.roles[0].role).toBe(Role.ROLE_USER);
  });
});
