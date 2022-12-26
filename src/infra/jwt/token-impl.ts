import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
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
  generate(login: string): string {
    const secret = process.env.JWT_SECRET;
    // 30 minutes
    const expiresIn = 1000 * 60 * 30;

    const token = jwt.sign({ login }, secret!, { expiresIn });
    return token;
  }
}
