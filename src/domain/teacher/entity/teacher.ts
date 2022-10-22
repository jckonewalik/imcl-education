import { Gender } from "@/domain/@shared/enums/gender";
import {
  BadRequestException,
  InvalidValueException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";

export class Teacher {
  private _id: string;
  private _name: string;
  private _gender: Gender;
  private _email: Email;
  private _active: boolean;

  constructor(
    id: string,
    name: string,
    gender: Gender,
    email: Email,
    active: boolean
  ) {
    if (!id) {
      throw new InvalidValueException(Messages.MISSING_TEACHER_ID);
    }
    this.validateName(name);

    this._id = id;
    this._name = name;
    this._gender = gender;
    this._email = email;
    this._active = active;
  }

  changeName(name: string) {
    this.validateName(name);
    this._name = name;
  }

  changeEmail(email: Email) {
    this._email = email;
  }

  activate() {
    if (this._active) {
      throw new BadRequestException(Messages.TEACHER_ALREADY_ACTIVE);
    }
    this._active = true;
  }

  inactivate() {
    if (!this._active) {
      throw new BadRequestException(Messages.TEACHER_ALREADY_INACTIVE);
    }
    this._active = false;
  }

  private validateName(name: string) {
    if (!name) {
      throw new InvalidValueException(Messages.MISSING_TEACHER_NAME);
    }
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get gender(): Gender {
    return this._gender;
  }

  get active(): boolean {
    return this._active;
  }

  get email(): Email {
    return this._email;
  }
}
