import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import { User } from "@/domain/user/entity/user";
import { FindUserRepository } from "@/domain/user/repository";
import { GetUserUseCase } from "./get-user";

export class GetUserUseCaseImpl implements GetUserUseCase {
  constructor(readonly findRepo: FindUserRepository) {}

  async get(email: string): Promise<User> {
    const emailVO = new Email(email);
    const user = await this.findRepo.find(emailVO);

    if (!user) {
      throw new EntityNotFoundException(Messages.INVALID_USER);
    }

    return user;
  }
}
