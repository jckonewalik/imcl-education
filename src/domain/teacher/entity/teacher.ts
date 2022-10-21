import { Gender } from "@/domain/@shared/enums/gender";
import { InvalidValueException } from "@/domain/@shared/exceptions";
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
    if (!name) {
      throw new InvalidValueException(Messages.MISSING_TEACHER_NAME);
    }

    this._id = id;
    this._name = name;
    this._gender = gender;
    this._email = email;
    this._active = active;
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
