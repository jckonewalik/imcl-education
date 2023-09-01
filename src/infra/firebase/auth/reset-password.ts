import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { ResetPasswordUseCase } from "@/usecases/auth/reset-password";
import { Logger } from "@nestjs/common";
import { FirebaseError } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
export class FirebaseResetPasswordUseCase implements ResetPasswordUseCase {

  private readonly logger = new Logger(FirebaseResetPasswordUseCase.name);

  async execute({
    email
  }: {
    email: string;
  }): Promise<string> {
    if (!email) {
      throw new BadRequestException(Messages.MISSING_LOGIN);
    }
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      return Messages.RESET_PASSWORD_EMAIL_SENT;
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/user-not-found") {
          return Messages.RESET_PASSWORD_EMAIL_SENT;
        }
      }
      this.logger.error(error);
      throw new BadRequestException(Messages.ERROR_DURING_PASSWORD_RESET);
    };
  }
}
