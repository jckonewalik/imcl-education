import BadRequestException from "../../@shared/exceptions/bad-request-exception";
import InvalidValueException from "../../@shared/exceptions/invalid-value-exception";
import Messages from "../../@shared/util/messages";
import Lesson from "./lesson";
import { v4 as uuid } from "uuid";
export default class Course {
  private _id: string;
  private _name: string;
  private _active: boolean;
  private _lessons: Lesson[] = [];

  constructor(
    id: string,
    name: string,
    active: boolean,
    lessons: Lesson[] = []
  ) {
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

  activate(): void {
    if (this._active) {
      throw new BadRequestException(Messages.COURSE_ALREADY_ACTIVE);
    }
    this._active = true;
  }

  inactivate(): void {
    if (!this._active) {
      throw new BadRequestException(Messages.COURSE_ALREADY_INACTIVE);
    }
    this._active = false;
  }

  addLesson(number: number, name: string): void {
    const exists = this._lessons.find((l) => l.number === number);
    if (exists) {
      throw new BadRequestException(Messages.DUPLICATED_LESSON_NUMBER);
    }
    const lesson = new Lesson(uuid(), this._id, number, name, true);
    this._lessons.push(lesson);
  }

  removeLesson(lesson: Lesson): void {
    this._lessons = this._lessons.filter((l) => l.id !== lesson.id);
  }

  get lessons(): Lesson[] {
    const lessons: Lesson[] = [];
    return lessons.concat(this._lessons);
  }
}
