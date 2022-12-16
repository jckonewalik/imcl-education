import {
  BadRequestException,
  InvalidValueException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import { User } from "@/domain/user/entity/user";
import { CreateUserRepository } from "@/domain/user/repository";
import { CreateCredentialsUseCase } from "@/usecases/auth";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { RegisterUserUseCase } from "../register-user";

type SutsProps = {
  createCredentialsResult?: boolean;
  users?: Map<string, User>;
};

type Suts = {
  createRepository: CreateUserRepository;
  createCredentialsUseCase: CreateCredentialsUseCase;
  sut: RegisterUserUseCase;
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

const makeSuts = ({
  users,
  createCredentialsResult = true,
}: SutsProps): Suts => {
  const findRepo = {
    find: async (email: Email): Promise<User | undefined> => {
      return users?.get(email.value);
    },
  };
  const createCredentialsUseCase = {
    async create(): Promise<boolean> {
      return createCredentialsResult;
    },
  };
  const createRepository = {
    async create(user: User): Promise<void> {},
  };
  const sut = new RegisterUserUseCase(
    findRepo,
    createCredentialsUseCase,
    createRepository
  );
  return { createCredentialsUseCase, createRepository, sut };
};

describe("Register User Use Case", () => {
  it("Fail registering a new user using an invalid email", async () => {
    const { sut } = makeSuts({});
    const password = faker.internet.password();

    const t = async () => {
      await sut.register({
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.random.word(),
        password,
        passwordConfirmation: password,
      });
    };
    await expect(t).rejects.toThrow(InvalidValueException);
    await expect(t).rejects.toThrow(Messages.INVALID_EMAIL);
  });

  it("Fail registering a new user using an existing email", async () => {
    const { user1, usersMap } = makeUsers();
    const { sut } = makeSuts({ users: usersMap });

    const password = faker.internet.password();
    const t = async () => {
      await sut.register({
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: user1.email.value,
        password,
        passwordConfirmation: password,
      });
    };

    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.USER_EMAIL_ALREADY_IN_USE);
  });

  it("Fail registering a new user if password confirmation doesnt match", async () => {
    const { sut } = makeSuts({});
    const password = faker.internet.password();

    const t = async () => {
      await sut.register({
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password,
        passwordConfirmation: faker.random.word(),
      });
    };
    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.INVALID_PASSWORD_CONFIRMATION);
  });

  it("Fail registering a new user if credentials not created successfully", async () => {
    const { sut } = makeSuts({ createCredentialsResult: false });
    const password = faker.internet.password();

    const t = async () => {
      await sut.register({
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password,
        passwordConfirmation: password,
      });
    };
    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.CREATE_USER_FAILED);
  });

  it("Register a new user", async () => {
    const { createRepository, createCredentialsUseCase, sut } = makeSuts({});
    const spyCreateCreds = jest.spyOn(createCredentialsUseCase, "create");
    const spyCreateUser = jest.spyOn(createRepository, "create");

    const password = faker.random.word();
    const user = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password,
    };
    const result = await sut.register(user);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(user.name);
    expect(result.email.value).toBe(user.email);
    expect(result.active).toBe(true);
    expect(spyCreateCreds).toHaveBeenCalledWith({
      email: new Email(user.email),
      password,
    });
    expect(spyCreateUser).toHaveBeenCalledWith(result);
  });
});
