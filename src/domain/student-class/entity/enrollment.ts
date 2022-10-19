import { InvalidValueException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";

export class Enrollment {
  private _id: string;
  private _classId: string;
  private _studentId: string;

  constructor(id: string, classId: string, studentId: string) {
    if (!id) {
      throw new InvalidValueException(Messages.MISSING_ENROLLMENT_ID);
    }
    if (!classId) {
      throw new InvalidValueException(Messages.MISSING_STUDENT_CLASS_ID);
    }
    if (!studentId) {
      throw new InvalidValueException(Messages.MISSING_STUDENT_ID);
    }
    this._id = id;
    this._classId = classId;
    this._studentId = studentId;
  }

  get id(): string {
    return this._id;
  }

  get classId(): string {
    return this._classId;
  }

  get studentId(): string {
    return this._studentId;
  }
}
