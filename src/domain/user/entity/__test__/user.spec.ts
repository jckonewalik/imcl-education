import {
  BadRequestException,
  InvalidValueException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { Role } from "../role";
import { User } from "../user";
const makeUser = ({
  id = uuid(),
  name = `${faker.name.firstName()} ${faker.name.lastName()}`,
  emailAddress = faker.internet.email(),
  active = true,
}) => {
  const email = new Email(emailAddress);
  return new User({ id, name, email, active });
};

describe("User Unit tests", () => {
  it("Fail when create a user without an ID", () => {
    const t = () => {
      makeUser({ id: "" });
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_USER_ID);
  });

  it("Fail when create a user without a name", () => {
    const t = () => {
      makeUser({ name: "" });
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_USER_NAME);
  });

  it("Create a user", () => {
    const id = uuid();
    const email = faker.internet.email();
    const name = `${faker.name.firstName} ${faker.name.lastName}`;
    const user = makeUser({ id, emailAddress: email, name });

    expect(user.id).toBe(id);
    expect(user.email.value).toStrictEqual(email);
    expect(user.name).toBe(name);
    expect(user.active).toBeTruthy();
    expect(user.roles.length).toBe(1);
    expect(user.roles[0].role).toBe(Role.ROLE_USER);
  });

  it("Fail when activate a user already active", () => {
    const user = makeUser({ active: true });

    const t = () => {
      user.activate();
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.USER_ALREADY_ACTIVE);
  });

  it("Fail when inactivate a user already inactive", () => {
    const user = makeUser({ active: false });

    const t = () => {
      user.inactivate();
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.USER_ALREADY_INACTIVE);
  });

  it("Activate a user", () => {
    const user = makeUser({ active: false });

    user.activate();
    expect(user.active).toBe(true);
  });

  it("Inactivate a user", () => {
    const user = makeUser({ active: true });

    user.inactivate();
    expect(user.active).toBe(false);
  });

  it("Fail changing a user name with invalid value", () => {
    const user = makeUser({});

    const t = () => {
      user.changeName("");
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_USER_NAME);
  });

  it("Change a user name", () => {
    const newName = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const user = makeUser({});

    user.changeName(newName);
    expect(user.name).toBe(newName);
  });

  it("Change a user email", () => {
    const newEmail = new Email(faker.internet.email());
    const user = makeUser({});

    user.changeEmail(newEmail);
    expect(user.email.value).toBe(newEmail.value);
  });

  it("Fail adding same role twice", () => {
    const user = makeUser({});
    const t = () => {
      user.addRole(Role.ROLE_USER);
    };

    expect(t).toThrow(Messages.DUPLICATED_ROLE);
  });

  it("Add role to user", () => {
    const user = makeUser({});
    user.addRole(Role.ROLE_ADMIN);

    expect(user.roles.length).toBe(2);
  });

  it("Fail removing invalid user role", () => {
    const user = makeUser({});
    const t = () => {
      user.removeRole(Role.ROLE_ADMIN);
    };

    expect(t).toThrow(Messages.INVALID_USER_ROLE);
  });

  it("Remove user role", () => {
    const user = makeUser({});
    user.removeRole(Role.ROLE_USER);

    expect(user.roles.length).toBe(0);
  });
});
