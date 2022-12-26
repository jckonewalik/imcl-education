import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import { User } from "@/domain/user/entity/user";
import faker from "faker";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { v4 as uuid } from "uuid";
import { FirebaseAuthenticateUseCase } from "../authenticate";
jest.mock("firebase/auth");

type SutProps = {
  user: User;
};

type Sut = {
  sut: FirebaseAuthenticateUseCase;
};

const makeSut = ({ user }: SutProps): Sut => {
  const getUseCase = {
    async get(email: string) {
      return user;
    },
  };
  return {
    sut: new FirebaseAuthenticateUseCase(getUseCase),
  };
};
const makeUser = ({
  id = uuid(),
  email = faker.internet.email(),
  active = true,
  name = faker.name.firstName(),
}) => {
  return new User({
    id,
    name,
    email: new Email(email),
    active,
  });
};
describe("Firebase Authenticate Use Case", () => {
  it("Fail authenticating if login is missing", async () => {
    const { sut } = makeSut({
      user: makeUser({}),
    });
    const login = "";

    const t = async () => {
      await sut.auth({
        login,
        password: faker.internet.password(),
      });
    };
    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.MISSING_LOGIN);
  });
  it("Fail authenticating if password is missing", async () => {
    const { sut } = makeSut({
      user: makeUser({}),
    });
    const password = "";

    const t = async () => {
      await sut.auth({
        login: faker.internet.email(),
        password,
      });
    };
    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.MISSING_PASSWORD);
  });

  it("Fail authenticating if user is inactive", async () => {
    const login = faker.internet.email();
    const password = faker.internet.password();

    const { sut } = makeSut({
      user: makeUser({ active: false, email: login }),
    });

    (getAuth as jest.Mock).mockResolvedValue({});
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({});

    const t = async () => {
      await sut.auth({
        login,
        password,
      });
    };
    expect(t).rejects.toThrow(Messages.USER_INACTIVE);
  });

  it("Fail authenticating if user is inactive", async () => {
    const login = faker.internet.email();
    const password = faker.internet.password();

    const { sut } = makeSut({
      user: makeUser({ email: login }),
    });

    (getAuth as jest.Mock).mockResolvedValue({});
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({});

    await sut.auth({
      login,
      password,
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      getAuth(),
      login,
      password
    );
  });
});
