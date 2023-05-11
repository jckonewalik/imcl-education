import { Gender } from "@/domain/@shared/enums/gender";
import {
  BadRequestException,
  InvalidValueException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { PhoneNumber } from "@/domain/@shared/value-objects";
import { Enrollment } from "@/domain/student-class/entity";

type Props = {
  id: string;
  name: string;
  gender: Gender;
  active: boolean;
  enrollments?: Enrollment[];
  phone?: PhoneNumber;
};
export class Student {
  private _id: string;
  private _name: string;
  private _gender: Gender;
  private _phone?: PhoneNumber;
  private _active: boolean;
  private _enrollments: Enrollment[] = [];
  constructor({ id, name, gender, active, enrollments = [], phone }: Props) {
    if (!id) {
      throw new InvalidValueException(Messages.MISSING_STUDENT_ID);
    }

    this.validateName(name);

    this._id = id;
    this._name = name;
    this._gender = gender;
    this._phone = phone;
    this._active = active;
    this._enrollments = enrollments;
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

  get phone(): PhoneNumber | undefined {
    return this._phone;
  }

  get active(): boolean {
    return this._active;
  }

  get enrollments(): Enrollment[] {
    const copy: Enrollment[] = [];
    return copy.concat(this._enrollments);
  }

  activate(): void {
    if (this._active) {
      throw new BadRequestException(Messages.STUDENT_ALREADY_ACTIVE);
    }
    this._active = true;
  }

  inactivate(): void {
    if (!this._active) {
      throw new BadRequestException(Messages.STUDENT_ALREADY_INACTIVE);
    }
    this._active = false;
  }

  changeName(name: string) {
    this.validateName(name);
    this._name = name;
  }

  changePhone(phoneNumber?: PhoneNumber) {
    this._phone = phoneNumber;
  }

  private validateName(name: string) {
    if (!name) {
      throw new InvalidValueException(Messages.MISSING_STUDENT_NAME);
    }
  }
}
