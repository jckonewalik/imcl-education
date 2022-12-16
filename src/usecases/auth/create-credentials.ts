import { Email } from "@/domain/@shared/value-objects";

type Props = {
  email: Email;
  password: string;
  passwordConfirmation: string;
};
export interface CreateCredentialsUseCase {
  create(props: Props): Promise<boolean>;
}
