import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { User } from "@/domain/user/entity/user";
import jwt from "jsonwebtoken";
import { GenerateToken, ValidateToken } from "../protocols";
export class JwtTokenImpl implements GenerateToken, ValidateToken {
  validate(token: string): string {
    try {
      const secret = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, secret!);
      return decoded["login"];
    } catch (err: any) {
      throw new BadRequestException(Messages.INVALID_TOKEN);
    }
  }
  generate(user: User): string {
    const secret = process.env.JWT_SECRET;
    // 30 minutes
    const expiresIn = 60 * 30;

    const token = jwt.sign(
      { user: user.email.value, roles: user.roles.map((r) => r.role) },
      secret!,
      { expiresIn }
    );
    return token;
  }
}
