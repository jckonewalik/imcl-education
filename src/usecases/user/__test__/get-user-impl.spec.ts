import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import { User } from "@/domain/user/entity/user";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { GetUserUseCase } from "../get-user";
import { GetUserUseCaseImpl } from "../get-user-impl";

type SutsProps = {
  users?: Map<string, User>;
};

type Suts = {
  sut: GetUserUseCase;
};

const makeUsers = () => {
  const user1 = new User({
    id: uuid(),
    email: new Email(faker.internet.email()),
    name: faker.name.firstName(),
    active: true,
  });

  const user2 = new User({
    id: uuid(),
    email: new Email(faker.internet.email()),
    name: faker.name.firstName(),
    active: true,
  });

  const usersMap = new Map<string, User>();
  usersMap.set(user1.email.value, user1);
  usersMap.set(user2.email.value, user2);

  return { user1, user2, usersMap };
};

const makeSuts = ({ users }: SutsProps): Suts => {
  const findRepo = {
    find: async (email: Email): Promise<User | undefined> => {
      return users?.get(email.value);
    },
  };

  const sut = new GetUserUseCaseImpl(findRepo);
  return { sut };
};

describe("Get User Use Case", () => {
  it("Get user by email", async () => {
    const { user1, usersMap } = makeUsers();
    const { sut } = makeSuts({ users: usersMap });

    const result = await sut.get(user1.email.value);

    expect(result.id).toBe(user1.id);
    expect(result.name).toBe(user1.name);
    expect(result.email).toBe(user1.email);
    expect(result.active).toBe(user1.active);
    expect(result.roles.length).toBe(1);
  });

  it("Fail getting a invalid user", async () => {
    const { sut } = makeSuts({});

    const t = async () => {
      await sut.get(faker.internet.email());
    };

    await expect(t).rejects.toThrow(EntityNotFoundException);
    await expect(t).rejects.toThrow(Messages.INVALID_USER);
  });
});
