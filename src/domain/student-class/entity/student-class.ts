import {
  BadRequestException,
  InvalidValueException,
} from "@/domain/@shared/exceptions";

import Messages from "@/domain/@shared/util/messages";
import { validate } from "uuid";

export class StudentClass {
  private _id: string;
  private _courseId: string;
  private _name: string;
  private _active: boolean;

  constructor(id: string, courseId: string, name: string, active: boolean) {
    if (!id) {
      throw new InvalidValueException(Messages.MISSING_STUDENT_CLASS_ID);
    }
    if (!courseId) {
      throw new InvalidValueException(Messages.MISSING_COURSE_ID);
    }
    this.validateName(name);
    this._id = id;
    this._courseId = courseId;
    this._name = name;
    this._active = active;
  }

  activate() {
    if (this._active) {
      throw new BadRequestException(Messages.CLASS_ALREADY_ACTIVE);
    }
    this._active = true;
  }

  inactivate() {
    if (!this._active) {
      throw new BadRequestException(Messages.CLASS_ALREADY_INACTIVE);
    }
    this._active = false;
  }

  changeName(name: string) {
    this.validateName(name);
    this._name = name;
  }

  private validateName(name: string) {
    if (!name) {
      throw new InvalidValueException(Messages.MISSING_STUDENT_CLASS_NAME);
    }
  }

  get active(): boolean {
    return this._active;
  }

  get name(): string {
    return this._name;
  }

  get id(): string {
    return this._id;
  }

  get courseId(): string {
    return this._courseId;
  }
}
