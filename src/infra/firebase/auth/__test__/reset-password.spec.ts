import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import faker from "faker";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { FirebaseResetPasswordUseCase } from "../reset-password";
jest.mock("firebase/auth");

type Sut = {
  sut: FirebaseResetPasswordUseCase;
};

const makeSut = (): Sut => {
  return {
    sut: new FirebaseResetPasswordUseCase(),
  };
};

describe("Firebase Reset Password Use Case", () => {
  it("Fail reset password if email is missing", async () => {
    const { sut } = makeSut();
    const email = "";

    const t = async () => {
      await sut.execute({
        email,
      });
    };
    await expect(t).rejects.toThrow(BadRequestException);
    await expect(t).rejects.toThrow(Messages.MISSING_LOGIN);
  });

  it("Success reset password", async () => {
    const email = faker.internet.email();

    const { sut } = makeSut();

    (getAuth as jest.Mock).mockResolvedValue({});
    (sendPasswordResetEmail as jest.Mock).mockResolvedValue({});

    await sut.execute({
      email
    });

    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      getAuth(),
      email
    );
  });
});
