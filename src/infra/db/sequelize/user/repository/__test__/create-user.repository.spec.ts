import { Email } from "@/domain/@shared/value-objects";
import { User } from "@/domain/user/entity/user";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import { UserModel, UserRoleModel } from "../../model";
import { SequelizeCreateUserRepository } from "../create-user-repository";
describe("Sequelize Create User Repository", () => {
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

  it("Create a user", async () => {
    const repository = new SequelizeCreateUserRepository();
    const user = new User({
      id: uuid(),
      name: `${faker.name.findName()} ${faker.name.lastName()}`,
      email: new Email(faker.internet.email()),
      active: true,
    });

    await repository.create(user);

    const userModel = await UserModel.findOne({
      where: { id: user.id },
      include: ["roles"],
    });

    expect(userModel).toBeDefined();
    expect(userModel?.id).toBe(user.id);
    expect(userModel?.name).toBe(user.name);
    expect(userModel?.email).toBe(user.email.value);
    expect(userModel?.active).toBe(user.active);
    expect(userModel?.roles.length).toBe(1);
    expect(userModel?.creationDate).toBeDefined();
    expect(userModel?.updatedOn).toBeDefined();
  });
});
