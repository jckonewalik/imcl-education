import {
  BadRequestException,
  InvalidValueException,
} from "@/domain/@shared/exceptions";
import { DateUtils } from "@/domain/@shared/util/date-utils";
import Messages from "@/domain/@shared/util/messages";
import { Lesson } from "@/domain/course/entity";
import { Student } from "@/domain/student/entity";
type Props = {
  id: string;
  studentClassId: string;
  date: Date;
  teacherId: string;
  studentIds: string[];
  lessonIds?: string[];
};
export class ClassRegistry {
  private _id: string;
  private _studentClassId: string;
  private _date: Date;
  private _teacherId: string;
  private _studentIds: string[];
  private _lessonIds: string[];

  constructor({
    id,
    studentClassId,
    date,
    teacherId,
    studentIds,
    lessonIds = [],
  }: Props) {
    if (!id) {
      throw new InvalidValueException(Messages.MISSING_CLASS_REGISTRY_ID);
    }
    if (!studentClassId) {
      throw new InvalidValueException(Messages.MISSING_STUDENT_CLASS_ID);
    }
    this.validateStudents(studentIds);
    this._id = id;
    this._studentClassId = studentClassId;
    this.updateDate(date);
    this.updateTeacher(teacherId);
    this._studentIds = studentIds;
    this._lessonIds = lessonIds;
  }

  private validateDate(date: Date) {
    const today = DateUtils.toSimpleDate(new Date());
    const dateCompare = DateUtils.toSimpleDate(date);

    if (dateCompare > today) {
      throw new InvalidValueException(Messages.CLASS_DATE_CANT_BE_IN_FUTURE);
    }
  }

  private validateStudents(studentIds: string[]) {
    if (studentIds.length < 1) {
      throw new InvalidValueException(Messages.CLASS_REGISTRY_WITH_NO_STUDENTS);
    }
  }

  public validate(): void {
    this.validateStudents(this._studentIds);
  }

  addStudent(student: Student) {
    if (this._studentIds.includes(student.id)) {
      return;
    }
    if (!student.active) {
      throw new BadRequestException(Messages.STUDENT_INACTIVE);
    }
    this._studentIds.push(student.id);
  }

  removeStudent(student: Student) {
    if (!this._studentIds.includes(student.id)) {
      return;
    }
    this._studentIds = this._studentIds.filter((id) => id !== student.id);
  }

  public addLesson(lesson: Lesson) {
    if (this._lessonIds.includes(lesson.id)) {
      return;
    }
    if (!lesson.active) {
      throw new BadRequestException(Messages.LESSON_INACTIVE);
    }
    this._lessonIds.push(lesson.id);
  }

  removeLesson(lesson: Lesson) {
    if (!this._lessonIds.includes(lesson.id)) {
      return;
    }
    this._lessonIds = this._lessonIds.filter((id) => id !== lesson.id);
  }

  updateDate(newDate: Date) {
    this.validateDate(newDate);
    this._date = DateUtils.toSimpleDate(newDate);
  }

  updateTeacher(teacherId: string) {
    if (!teacherId) {
      throw new InvalidValueException(Messages.MISSING_TEACHER_ID);
    }
    this._teacherId = teacherId;
  }

  get id(): string {
    return this._id;
  }

  get studentClassId(): string {
    return this._studentClassId;
  }

  get date(): Date {
    return this._date;
  }

  get teacherId(): string {
    return this._teacherId;
  }

  get studentIds(): string[] {
    const studentIds: string[] = [];
    return studentIds.concat(this._studentIds);
  }

  get lessonIds(): string[] {
    const lessonIds: string[] = [];
    return lessonIds.concat(this._lessonIds);
  }
}
