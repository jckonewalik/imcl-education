import { Email } from "@/domain/@shared/value-objects";
import { User } from "@/domain/user/entity/user";
import { FindUserRepository } from "@/domain/user/repository";
import { Sequelize } from "sequelize-typescript";
import { UserModel } from "../model";

export class SequelizeFindUserRepository implements FindUserRepository {
  async find(email: Email): Promise<User | undefined> {
    const user = await UserModel.findOne({
      where: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("email")),
        Sequelize.fn("lower", email.value)
      ),
      include: ["roles"],
    });

    if (user) {
      return user.toEntity();
    }
  }
}
