import { Email } from "@/domain/@shared/value-objects";
import { User } from "@/domain/user/entity/user";
import { FindUserRepository } from "@/domain/user/repository";
import { UserModel } from "../model";

export class SequelizeFindUserRepository implements FindUserRepository {
  async find(email: Email): Promise<User | undefined> {
    const user = await UserModel.findOne({
      where: { email: email.value },
      include: ["roles"],
    });

    if (user) {
      return user.toEntity();
    }
  }
}
