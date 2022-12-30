import { Email } from "@/domain/@shared/value-objects";
import { Role } from "@/domain/user/entity/role";
import { User } from "@/domain/user/entity/user";
import { JwtTokenImpl } from "@/infra/jwt/token-impl";
import faker from "faker";
import { v4 as uuid } from "uuid";
type makeJwtTokenProps = {
  login?: string;
  roles?: Role[];
};
export const makeJwtToken = ({
  login = faker.internet.email(),
  roles = [],
}: makeJwtTokenProps) => {
  const user = new User({
    id: uuid(),
    name: faker.name.firstName(),
    active: true,
    email: new Email(login),
  });
  roles.forEach((role) => user.addRole(role));

  const service = new JwtTokenImpl();
  return service.generate(user);
};
