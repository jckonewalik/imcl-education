import { Gender } from "@/domain/@shared/enums/gender";
import {
  BadRequestException,
  InvalidValueException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { PhoneNumber } from "@/domain/@shared/value-objects";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { Student } from "../student";

describe("Student Unit tests", () => {
  it("Fail when create a student without an ID", () => {
    const phoneNumber = new PhoneNumber("99999999999", true);

    const t = () => {
      new Student({
        id: "",
        name: faker.name.firstName(),
        gender: Gender.M,
        active: true,
        phone: phoneNumber,
      });
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_ID);
  });

  it("Fail when create a student class without a name", () => {
    const t = () => {
      new Student({ id: uuid(), name: "", gender: Gender.F, active: true });
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_NAME);
  });

  it("Fail activating a Student already active", () => {
    const student = new Student({
      id: uuid(),
      name: faker.name.firstName(),
      gender: Gender.F,
      active: true,
    });
    const t = () => {
      student.activate();
    };

    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.STUDENT_ALREADY_ACTIVE);
  });
  it("Activate a Student", () => {
    const student = new Student({
      id: uuid(),
      name: faker.name.firstName(),
      gender: Gender.F,
      active: false,
    });
    student.activate();
    expect(student.active).toBe(true);
  });

  it("Fail inactivating a Student already inactive", () => {
    const student = new Student({
      id: uuid(),
      name: faker.name.firstName(),
      gender: Gender.F,
      active: false,
    });
    const t = () => {
      student.inactivate();
    };

    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.STUDENT_ALREADY_INACTIVE);
  });
  it("Inactivate a Student", () => {
    const student = new Student({
      id: uuid(),
      name: faker.name.firstName(),
      gender: Gender.F,
      active: true,
    });
    student.inactivate();
    expect(student.active).toBe(false);
  });

  it("Fail changing name using an invalid name", () => {
    const student = new Student({
      id: uuid(),
      name: faker.name.firstName(),
      gender: Gender.F,
      active: true,
    });
    const t = () => {
      student.changeName("");
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_NAME);
  });
  it("Changing name", () => {
    const student = new Student({
      id: uuid(),
      name: faker.name.firstName(),
      gender: Gender.F,
      active: true,
    });
    const newName = faker.name.firstName();
    student.changeName(newName);
    expect(student.name).toBe(newName);
  });
});
