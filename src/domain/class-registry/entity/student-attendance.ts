import { InvalidValueException } from "@/domain/@shared/exceptions";
import { DateUtils } from "@/domain/@shared/util/date-utils";
import Messages from "@/domain/@shared/util/messages";

type Props = {
  studentClassId: string;
  studentId: string;
  lessonId: string;
  date?: Date;
  finished: boolean;
};
export class StudentAttendance {
  private _studentClassId: string;
  private _studentId: string;
  private _lessonId: string;
  private _date?: Date;
  private _finished: boolean;

  constructor({ studentClassId, studentId, lessonId, date, finished }: Props) {
    if (!studentClassId) {
      throw new InvalidValueException(Messages.MISSING_STUDENT_CLASS_ID);
    }
    if (!studentId) {
      throw new InvalidValueException(Messages.MISSING_STUDENT_ID);
    }
    if (!lessonId) {
      throw new InvalidValueException(Messages.MISSING_LESSON_ID);
    }

    if (finished && !date) {
      throw new InvalidValueException(Messages.MISSING_ATTENDANCE_DATE);
    }

    this._studentClassId = studentClassId;
    this._studentId = studentId;
    this._lessonId = lessonId;
    this._date = date && DateUtils.toSimpleDate(date);
    this._finished = finished;
  }

  get studentClassId(): string {
    return this._studentClassId;
  }

  get studentId(): string {
    return this._studentId;
  }

  get lessonId(): string {
    return this._lessonId;
  }

  get date(): Date | undefined {
    return this._date;
  }

  get finished(): boolean {
    return this._finished;
  }
}
