import Course from "../../course/entity/course";
import InvalidValueException from "../../@shared/exceptions/invalid-value-exception";
import Messages from "../../util/messages";
import StudentClass from "../entity/student-class";
import { v4 as uuid } from "uuid";
export default class StudentClassService {
  static newStudentClass(course: Course, name: string): StudentClass {
    if (!course.active) {
      throw new InvalidValueException(Messages.REQUIRES_ACTIVE_COURSE);
    }
    return new StudentClass(uuid(), course.id, name, true);
  }
}
