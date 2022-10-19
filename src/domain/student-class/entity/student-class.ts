import {
  BadRequestException,
  InvalidValueException,
} from "@/domain/@shared/exceptions";

import Messages from "@/domain/@shared/util/messages";
import { Student } from "@/domain/student/entity/student";
import { Enrollment } from "./enrollment";
import { v4 as uuid } from "uuid";

export class StudentClass {
  private _id: string;
  private _courseId: string;
  private _name: string;
  private _active: boolean;
  private _enrollments: Enrollment[] = [];

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

  enrollStudent(student: Student) {
    if (!this._active) {
      throw new BadRequestException(Messages.STUDENT_CLASS_INACTIVE);
    }
    if (!student.active) {
      throw new BadRequestException(Messages.STUDENT_INACTIVE);
    }
    if (this._enrollments.find((e) => e.studentId === student.id)) {
      throw new BadRequestException(Messages.STUDENT_ALREADY_ENROLLED);
    }
    const newEnrollment = new Enrollment(uuid(), this._id, student.id);
    this._enrollments.push(newEnrollment);
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

  get enrollments(): Enrollment[] {
    const copy: Enrollment[] = [];
    return copy.concat(this._enrollments);
  }
}
