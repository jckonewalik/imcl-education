import { CreateRepository } from "@/domain/@shared/repository/repository";
import { Email } from "@/domain/@shared/value-objects";
import { User } from "../entity/user";

export interface FindUserRepository {
  find(email: Email): Promise<User | undefined>;
}

export interface CreateUserRepository extends CreateRepository<User> {}
