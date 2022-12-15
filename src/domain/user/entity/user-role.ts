import { Role } from "./role";

type ConstructorProps = {
  userId: string;
  role: Role;
};
export class UserRole {
  private _userId: string;
  private _role: Role;
  constructor({ userId, role }: ConstructorProps) {
    this._userId = userId;
    this._role = role;
  }

  get userId() {
    return this._userId;
  }

  get role() {
    return this._role;
  }
}
