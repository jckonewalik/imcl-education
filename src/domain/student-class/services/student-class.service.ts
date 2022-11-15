import { InvalidValueException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Course } from "@/domain/course/entity";
import { StudentClass } from "@/domain/student-class/entity";
import { v4 as uuid } from "uuid";
export default class StudentClassService {
  static newStudentClass(
    course: Course,
    name: string,
    year?: number
  ): StudentClass {
    if (!course.active) {
      throw new InvalidValueException(Messages.REQUIRES_ACTIVE_COURSE);
    }
    return StudentClass.Builder.builder(uuid(), course.id, name, true)
      .year(year)
      .build();
  }
}
