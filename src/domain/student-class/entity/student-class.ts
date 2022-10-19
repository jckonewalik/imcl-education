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

  private constructor(
    id: string,
    courseId: string,
    name: string,
    active: boolean,
    enrollments: Enrollment[] = []
  ) {
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
    this._enrollments = enrollments;
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

  unenrollStudent(student: Student) {
    if (!this._enrollments.find((e) => e.studentId === student.id)) {
      throw new BadRequestException(Messages.STUDENT_NOT_ENROLLED);
    }
    this._enrollments = this._enrollments.filter(
      (e) => e.studentId !== student.id
    );
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

  static Builder = class {
    private _id: string = "";
    private _courseId: string = "";
    private _name: string = "";
    private _active: boolean = true;
    private _enrollments: Enrollment[] = [];

    static builder() {
      return new StudentClass.Builder();
    }

    id(id: string) {
      this._id = id;
      return this;
    }

    courseId(courseId: string) {
      this._courseId = courseId;
      return this;
    }

    name(name: string) {
      this._name = name;
      return this;
    }

    active(active: boolean) {
      this._active = active;
      return this;
    }

    enrollments(enrollments: Enrollment[]) {
      this._enrollments = enrollments;
      return this;
    }

    build(): StudentClass {
      return new StudentClass(
        this._id,
        this._courseId,
        this._name,
        this._active,
        this._enrollments
      );
    }
  };
}
