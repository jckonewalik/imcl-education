import {
  BadRequestException,
  InvalidValueException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import { Role } from "./role";
import { UserRole } from "./user-role";

type ConstructorProps = {
  id: string;
  name: string;
  email: Email;
  active: boolean;
  roles?: UserRole[];
};
export class User {
  private _id: string;
  private _email: Email;
  private _name: string;
  private _active: boolean;
  private _roles: UserRole[];

  constructor({
    id,
    name,
    email,
    active,
    roles = [new UserRole({ userId: id, role: Role.ROLE_USER })],
  }: ConstructorProps) {
    if (!id) {
      throw new InvalidValueException(Messages.MISSING_USER_ID);
    }

    this._id = id;
    this._email = email;
    this.changeName(name);
    this._active = active;
    this._roles = roles;
  }

  get id() {
    return this._id;
  }

  get email() {
    return this._email;
  }

  get name() {
    return this._name;
  }

  get active() {
    return this._active;
  }

  get roles(): UserRole[] {
    const roles: UserRole[] = [];
    return roles.concat(this._roles);
  }

  activate() {
    if (this._active) {
      throw new BadRequestException(Messages.USER_ALREADY_ACTIVE);
    }
    this._active = true;
  }

  inactivate() {
    if (!this._active) {
      throw new BadRequestException(Messages.USER_ALREADY_INACTIVE);
    }
    this._active = false;
  }

  changeName(newName: string) {
    if (!newName) {
      throw new InvalidValueException(Messages.MISSING_USER_NAME);
    }
    this._name = newName;
  }

  changeEmail(newEmail: Email) {
    this._email = newEmail;
  }

  addRole(role: Role) {
    if (this.roles.find((r) => r.role === role)) {
      throw new BadRequestException(Messages.DUPLICATED_ROLE);
    }
    this._roles.push(new UserRole({ userId: this._id, role }));
  }

  removeRole(role: Role) {
    if (!this.roles.find((r) => r.role === role)) {
      throw new BadRequestException(Messages.INVALID_USER_ROLE);
    }
    this._roles = this.roles.filter((r) => r.role !== role);
  }
}
