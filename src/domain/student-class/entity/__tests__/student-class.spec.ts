import {
  InvalidValueException,
  BadRequestException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { StudentClass } from "../student-class";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { Student } from "@/domain/student/entity/student";
import { Gender } from "@/domain/@shared/enums/gender";

const makeStudentClass = ({
  id = uuid(),
  courseId = uuid(),
  name = faker.name.jobArea(),
  active = true,
}): StudentClass => {
  return StudentClass.Builder.builder()
    .id(id)
    .courseId(courseId)
    .name(name)
    .active(active)
    .build();
};

describe("Student Class Unit tests", () => {
  it("Fail when create a student class without an ID", () => {
    const t = () => {
      StudentClass.Builder.builder()
        .courseId(uuid())
        .name(faker.name.jobArea())
        .active(true)
        .build();
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_CLASS_ID);
  });

  it("Fail when create a student class without a course ID", () => {
    const t = () => {
      StudentClass.Builder.builder()
        .id(uuid())
        .name(faker.name.jobArea())
        .active(true)
        .build();
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_COURSE_ID);
  });

  it("Fail when create a course without a name", () => {
    const t = () => {
      StudentClass.Builder.builder()
        .id(uuid())
        .courseId(uuid())
        .active(true)
        .build();
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_CLASS_NAME);
  });

  it("Fail when activate a class already active", () => {
    const studentClass = makeStudentClass({});

    const t = () => {
      studentClass.activate();
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.CLASS_ALREADY_ACTIVE);
  });

  it("Fail when inactivate a class already inactive", () => {
    const studentClass = makeStudentClass({ active: false });

    const t = () => {
      studentClass.inactivate();
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.CLASS_ALREADY_INACTIVE);
  });

  it("Activate a class", () => {
    const studentClass = makeStudentClass({ active: false });

    studentClass.activate();
    expect(studentClass.active).toBe(true);
  });

  it("Inactivate a class", () => {
    const studentClass = makeStudentClass({});

    studentClass.inactivate();
    expect(studentClass.active).toBe(false);
  });

  it("Fail when enroll a new student if the class is inactive", () => {
    const studentClass = makeStudentClass({ active: false });
    const student = new Student(uuid(), faker.name.firstName(), Gender.M, true);

    const t = () => {
      studentClass.enrollStudent(student);
    };

    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.STUDENT_CLASS_INACTIVE);
  });

  it("Fail when enroll a new student if the student is inactive", () => {
    const studentClass = makeStudentClass({});
    const student = new Student(
      uuid(),
      faker.name.firstName(),
      Gender.M,
      false
    );

    const t = () => {
      studentClass.enrollStudent(student);
    };

    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.STUDENT_INACTIVE);
  });

  it("Enroll a new student", () => {
    const studentClass = makeStudentClass({});
    const student = new Student(uuid(), faker.name.firstName(), Gender.M, true);
    studentClass.enrollStudent(student);

    expect(studentClass.enrollments.length).toBe(1);
  });

  it("Fail when Enroll a student twice", () => {
    const studentClass = makeStudentClass({});
    const student = new Student(uuid(), faker.name.firstName(), Gender.M, true);
    studentClass.enrollStudent(student);

    const t = () => {
      studentClass.enrollStudent(student);
    };

    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.STUDENT_ALREADY_ENROLLED);
  });
});
