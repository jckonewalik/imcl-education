import BadRequestException from "../../exceptions/bad-request-exception";
import InvalidValueException from "../../exceptions/invalid-value-exception";
import Messages from "../../util/messages";

export default class Course {
  private _id: string;
  private _name: string;
  private _active: boolean;

  constructor(id: string, name: string, active: boolean) {
    if (!id) {
      throw new InvalidValueException(Messages.MISSING_COURSE_ID);
    }
    if (!name) {
      throw new InvalidValueException(Messages.MISSING_COURSE_NAME);
    }
    this._id = id;
    this._name = name;
    this._active = active;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get active(): boolean {
    return this._active;
  }

  activate() {
    if (this._active) {
      throw new BadRequestException(Messages.COURSE_ALREADY_ACTIVE);
    }
    this._active = true;
  }

  inactivate() {
    if (!this._active) {
      throw new BadRequestException(Messages.COURSE_ALREADY_INACTIVE);
    }
    this._active = false;
  }
}
