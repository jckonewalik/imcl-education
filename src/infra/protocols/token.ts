import { User } from "@/domain/user/entity/user";

export interface GenerateToken {
  generate(user: User): string;
}

export interface ValidateToken {
  validate(token: string): string;
}
