import {
  BadRequestException,
  InvalidValueException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";

export class Lesson {
  private _id: string;
  private _courseId: string;
  private _number: number;
  private _name: string;
  private _active: boolean;

  constructor(
    id: string,
    courseId: string,
    number: number,
    name: string,
    active: boolean
  ) {
    if (!id) {
      throw new InvalidValueException(Messages.MISSING_LESSON_ID);
    }
    if (!courseId) {
      throw new InvalidValueException(Messages.MISSING_COURSE_ID);
    }
    if (number <= 0) {
      throw new InvalidValueException(Messages.INVALID_LESSON_NUMBER);
    }
    if (!name) {
      throw new InvalidValueException(Messages.MISSING_LESSON_NAME);
    }
    this._id = id;
    this._courseId = courseId;
    this._number = number;
    this._name = name;
    this._active = active;
  }

  activate() {
    if (this._active) {
      throw new BadRequestException(Messages.LESSON_ALREADY_ACTIVE);
    }
    this._active = true;
  }

  inactivate() {
    if (!this._active) {
      throw new BadRequestException(Messages.LESSON_ALREADY_INACTIVE);
    }
    this._active = false;
  }

  get active(): boolean {
    return this._active;
  }

  get number(): number {
    return this._number;
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
