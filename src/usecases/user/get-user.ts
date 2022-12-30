import { User } from "@/domain/user/entity/user";

export interface GetUserUseCase {
  get(email: string): Promise<User>;
}
