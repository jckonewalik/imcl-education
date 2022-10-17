import { Course } from "@/domain/course/entity";
import { v4 as uuid } from "uuid";
import faker from "faker";
import StudentClassService from "./student-class.service";
import { InvalidValueException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
describe("Student Class Service unit tests", () => {
  it("Fail when create a new class using an inactive course", () => {
    const course = new Course(uuid(), faker.name.jobArea(), false);

    const t = () => {
      StudentClassService.newStudentClass(course, faker.name.jobDescriptor());
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.REQUIRES_ACTIVE_COURSE);
  });

  it("Create a new class", () => {
    const course = new Course(uuid(), faker.name.jobArea(), true);

    const className = faker.name.jobDescriptor();
    const studentClass = StudentClassService.newStudentClass(course, className);

    expect(studentClass.id).toBeDefined();
    expect(studentClass.name).toBe(className);
    expect(studentClass.courseId).toBe(course.id);
    expect(studentClass.active).toBe(true);
  });
});
