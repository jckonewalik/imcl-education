import { Email } from "@/domain/@shared/value-objects";

type Props = {
  email: Email;
  password: string;
};
export interface CreateCredentialsUseCase {
  create(props: Props): Promise<boolean>;
}
