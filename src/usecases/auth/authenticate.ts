import { User } from "@/domain/user/entity/user";

type Props = {
  login: string;
  password: string;
};
export interface AuthenticateUseCase {
  auth(props: Props): Promise<User>;
}
