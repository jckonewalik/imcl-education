import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import faker from "faker";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { FirebaseCreateCredentialsUseCase } from "../create-credentials";

jest.mock("firebase/auth");

type SutProps = {};

type Sut = {
  sut: FirebaseCreateCredentialsUseCase;
};

const makeSut = ({}: SutProps): Sut => {
  return {
    sut: new FirebaseCreateCredentialsUseCase(),
  };
};
describe("Firebase Create Credentials Use Case", () => {
  it("Fail create credentials if password is missing", async () => {
    const { sut } = makeSut({});
    const password = "";

    const t = async () => {
      await sut.create({
        email: new Email(faker.internet.email()),
        password,
        passwordConfirmation: faker.random.word(),
      });
    };
    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.MISSING_PASSWORD);
  });
  it("Fail create credentials if password confirmation doesnt match", async () => {
    const { sut } = makeSut({});
    const password = faker.internet.password();

    const t = async () => {
      await sut.create({
        email: new Email(faker.internet.email()),
        password,
        passwordConfirmation: faker.random.word(),
      });
    };
    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.INVALID_PASSWORD_CONFIRMATION);
  });

  it("Create firebase credentials", async () => {
    const { sut } = makeSut({});
    const password = faker.internet.password();

    (getAuth as jest.Mock).mockResolvedValue({});
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({});
    const email = new Email(faker.internet.email());
    await sut.create({
      email,
      password,
      passwordConfirmation: password,
    });
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      getAuth(),
      email.value,
      password
    );
  });
});
