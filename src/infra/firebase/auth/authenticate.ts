import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { User } from "@/domain/user/entity/user";
import { AuthenticateUseCase } from "@/usecases/auth/authenticate";
import { GetUserUseCase } from "@/usecases/user";
import { Logger } from "@nestjs/common";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
export class FirebaseAuthenticateUseCase implements AuthenticateUseCase {
  private readonly logger = new Logger(FirebaseAuthenticateUseCase.name);

  constructor(private readonly getUser: GetUserUseCase) {}

  async auth({
    login,
    password,
  }: {
    login: string;
    password: string;
  }): Promise<User> {
    if (!login) {
      throw new BadRequestException(Messages.MISSING_LOGIN);
    }
    if (!password) {
      throw new BadRequestException(Messages.MISSING_PASSWORD);
    }
    const auth = getAuth();
    let user;
    try {
      await signInWithEmailAndPassword(auth, login, password);
      user = await this.getUser.get(login);
    } catch (error: any) {
      this.logger.error(error);
      throw new BadRequestException(Messages.INVALID_CREDENTIALS);
    }
    if (!user.active) {
      throw new BadRequestException(Messages.USER_INACTIVE);
    }
    return user;
  }
}
