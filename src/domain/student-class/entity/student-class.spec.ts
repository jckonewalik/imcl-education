import InvalidValueException from "../../@shared/exceptions/invalid-value-exception";
import Messages from "../../@shared/util/messages";
import StudentClass from "./student-class";
import faker from "faker";
import { v4 as uuid } from "uuid";
import BadRequestException from "../../@shared/exceptions/bad-request-exception";

describe("Student Class Unit tests", () => {
  it("Fail when create a student class without an ID", () => {
    const t = () => {
      new StudentClass("", uuid(), faker.name.jobArea(), true);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_CLASS_ID);
  });

  it("Fail when create a student class without a course ID", () => {
    const t = () => {
      new StudentClass(uuid(), "", faker.name.jobArea(), true);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_COURSE_ID);
  });

  it("Fail when create a course without a name", () => {
    const t = () => {
      new StudentClass(uuid(), uuid(), "", true);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_CLASS_NAME);
  });

  it("Fail when activate a class already active", () => {
    const studentClass = new StudentClass(
      uuid(),
      uuid(),
      faker.name.jobArea(),
      true
    );

    const t = () => {
      studentClass.activate();
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.CLASS_ALREADY_ACTIVE);
  });

  it("Fail when inactivate a class already inactive", () => {
    const studentClass = new StudentClass(
      uuid(),
      uuid(),
      faker.name.jobArea(),
      false
    );

    const t = () => {
      studentClass.inactivate();
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.CLASS_ALREADY_INACTIVE);
  });

  it("Activate a class", () => {
    const studentClass = new StudentClass(
      uuid(),
      uuid(),
      faker.name.jobArea(),
      false
    );

    studentClass.activate();
    expect(studentClass.active).toBe(true);
  });

  it("Inactivate a class", () => {
    const studentClass = new StudentClass(
      uuid(),
      uuid(),
      faker.name.jobArea(),
      true
    );

    studentClass.inactivate();
    expect(studentClass.active).toBe(false);
  });
});
