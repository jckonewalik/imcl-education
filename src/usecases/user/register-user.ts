import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import { User } from "@/domain/user/entity/user";
import {
  CreateUserRepository,
  FindUserRepository,
} from "@/domain/user/repository";
import { v4 as uuid } from "uuid";
import { CreateCredentialsUseCase } from "../auth";
type RegisterProps = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};
export class RegisterUserUseCase {
  constructor(
    readonly findRepo: FindUserRepository,
    readonly createCredentials: CreateCredentialsUseCase,
    readonly createUserRepo: CreateUserRepository
  ) {}

  async register({
    name,
    email,
    password,
    passwordConfirmation,
  }: RegisterProps): Promise<User> {
    const emailVO = new Email(email);
    const exists = await this.findRepo.find(emailVO);

    if (exists) {
      throw new BadRequestException(Messages.USER_EMAIL_ALREADY_IN_USE);
    }

    if (password !== passwordConfirmation) {
      throw new BadRequestException(Messages.INVALID_PASSWORD_CONFIRMATION);
    }

    const credsCreated = await this.createCredentials.create({
      email: emailVO,
      password,
    });
    if (!credsCreated) {
      throw new BadRequestException(Messages.CREATE_USER_FAILED);
    }
    const user = new User({ id: uuid(), name, email: emailVO, active: true });
    this.createUserRepo.create(user);

    return user;
  }
}
