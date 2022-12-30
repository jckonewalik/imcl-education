import { User } from "@/domain/user/entity/user";
import { CreateUserRepository } from "@/domain/user/repository";
import { UserModel } from "../model";

export class SequelizeCreateUserRepository implements CreateUserRepository {
  async create(entity: User): Promise<void> {
    await UserModel.create(
      {
        id: entity.id,
        name: entity.name,
        email: entity.email.value,
        active: entity.active,
        roles: entity.roles.map((r) => ({
          userId: entity.id,
          role: r.role,
        })),
      },
      {
        include: ["roles"],
      }
    );
  }
}
