import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import { CreateCredentialsUseCase } from "@/usecases/auth";
import { Logger } from "@nestjs/common";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
export class FirebaseCreateCredentialsUseCase
  implements CreateCredentialsUseCase
{
  private readonly logger = new Logger(FirebaseCreateCredentialsUseCase.name);

  async create(props: {
    email: Email;
    password: string;
    passwordConfirmation: string;
  }): Promise<boolean> {
    if (!props.password) {
      throw new BadRequestException(Messages.MISSING_PASSWORD);
    }

    if (props.password !== props.passwordConfirmation) {
      throw new BadRequestException(Messages.INVALID_PASSWORD_CONFIRMATION);
    }
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(
        auth,
        props.email.value,
        props.password
      );
      return true;
    } catch (error: any) {
      this.logger.error(error);
      return false;
    }
  }
}
