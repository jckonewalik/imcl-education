import {
  BadRequestException,
  InvalidValueException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Student } from "../student";
import { v4 as uuid } from "uuid";
import faker from "faker";
import { Gender } from "@/domain/@shared/enums/gender";
import { PhoneNumber } from "@/domain/@shared/value-objects";

describe("Student Unit tests", () => {
  it("Fail when create a student without an ID", () => {
    const phoneNumber = new PhoneNumber("99999999999", true);

    const t = () => {
      new Student("", faker.name.firstName(), Gender.M, true, phoneNumber);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_ID);
  });

  it("Fail when create a student class without a name", () => {
    const t = () => {
      new Student(uuid(), "", Gender.F, true);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_NAME);
  });

  it("Fail activating a Student already active", () => {
    const student = new Student(uuid(), faker.name.firstName(), Gender.F, true);
    const t = () => {
      student.activate();
    };

    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.STUDENT_ALREADY_ACTIVE);
  });
  it("Activate a Student", () => {
    const student = new Student(
      uuid(),
      faker.name.firstName(),
      Gender.F,
      false
    );
    student.activate();
    expect(student.active).toBe(true);
  });

  it("Fail inactivating a Student already inactive", () => {
    const student = new Student(
      uuid(),
      faker.name.firstName(),
      Gender.F,
      false
    );
    const t = () => {
      student.inactivate();
    };

    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.STUDENT_ALREADY_INACTIVE);
  });
  it("Inactivate a Student", () => {
    const student = new Student(uuid(), faker.name.firstName(), Gender.F, true);
    student.inactivate();
    expect(student.active).toBe(false);
  });

  it("Fail changing name using an invalid name", () => {
    const student = new Student(uuid(), faker.name.firstName(), Gender.F, true);
    const t = () => {
      student.changeName("");
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_NAME);
  });
  it("Changing name", () => {
    const student = new Student(uuid(), faker.name.firstName(), Gender.F, true);
    const newName = faker.name.firstName();
    student.changeName(newName);
    expect(student.name).toBe(newName);
  });
});
