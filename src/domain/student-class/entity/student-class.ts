import {
  BadRequestException,
  InvalidValueException,
} from "@/domain/@shared/exceptions";

import Messages from "@/domain/@shared/util/messages";
import { Student } from "@/domain/student/entity/student";
import { Enrollment } from "./enrollment";
import { v4 as uuid } from "uuid";
import { Teacher } from "@/domain/teacher/entity";

export class StudentClass {
  private _id: string;
  private _courseId: string;
  private _name: string;
  private _active: boolean;
  private _teacherIds: string[] = [];
  private _enrollments: Enrollment[] = [];

  private constructor(
    id: string,
    courseId: string,
    name: string,
    active: boolean,
    teacherIds: string[] = [],
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
    this._teacherIds = teacherIds;
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

  addTeacher(teacher: Teacher) {
    if (!this._active) {
      throw new BadRequestException(Messages.STUDENT_CLASS_INACTIVE);
    }
    if (!teacher.active) {
      throw new BadRequestException(Messages.TEACHER_INACTIVE);
    }
    if (this._teacherIds.find((id) => id === teacher.id)) {
      throw new BadRequestException(Messages.TEACHER_ALREADY_INCLUDED);
    }
    this._teacherIds.push(teacher.id);
  }

  removeTeacher(teacher: Teacher) {
    if (!this._teacherIds.find((id) => id === teacher.id)) {
      throw new BadRequestException(Messages.TEACHER_NOT_PRESENT);
    }
    this._teacherIds = this._teacherIds.filter((id) => id !== teacher.id);
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

  get teacherIds(): string[] {
    const copy: string[] = [];
    return copy.concat(this._teacherIds);
  }

  static Builder = class {
    private _id: string = "";
    private _courseId: string = "";
    private _name: string = "";
    private _active: boolean = true;
    private _teacherIds: string[] = [];
    private _enrollments: Enrollment[] = [];

    static builder(id: string, courseId: string, name: string) {
      const builder = new StudentClass.Builder();
      builder._id = id;
      builder._courseId = courseId;
      builder._name = name;
      return builder;
    }

    active(active: boolean) {
      this._active = active;
      return this;
    }

    enrollments(enrollments: Enrollment[]) {
      this._enrollments = enrollments;
      return this;
    }

    teacherIds(teacherIds: string[]) {
      this._teacherIds = teacherIds;
      return this;
    }

    build(): StudentClass {
      return new StudentClass(
        this._id,
        this._courseId,
        this._name,
        this._active,
        this._teacherIds,
        this._enrollments
      );
    }
  };
}
