import { Course } from "@/domain/course/entity";
import { InvalidValueException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { StudentClass } from "@/domain/student-class/entity";
import { v4 as uuid } from "uuid";
export default class StudentClassService {
  static newStudentClass(course: Course, name: string): StudentClass {
    if (!course.active) {
      throw new InvalidValueException(Messages.REQUIRES_ACTIVE_COURSE);
    }
    return new StudentClass(uuid(), course.id, name, true);
  }
}
