import InvalidValueException from "../../exceptions/invalid-value-exception";
import Messages from "../../util/messages";
import Lesson from "./lesson";
import faker from "faker";
import { v4 as uuid } from "uuid";
import BadRequestException from "../../exceptions/bad-request-exception";

describe("Lesson Unit tests", () => {
  it("Fail when create a lesson without an ID", () => {
    const t = () => {
      new Lesson("", uuid(), 1, faker.name.jobDescriptor(), true);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_LESSON_ID);
  });

  it("Fail when create a lesson without a course ID", () => {
    const t = () => {
      new Lesson(uuid(), "", 1, faker.name.jobDescriptor(), true);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_COURSE_ID);
  });

  it("Fail when create a lesson with an invalid number", () => {
    const t1 = () => {
      new Lesson(uuid(), uuid(), 0, faker.name.jobDescriptor(), true);
    };
    const t2 = () => {
      new Lesson(uuid(), uuid(), -1, faker.name.jobDescriptor(), true);
    };
    expect(t1).toThrow(InvalidValueException);
    expect(t1).toThrow(Messages.INVALID_LESSON_NUMBER);
    expect(t2).toThrow(InvalidValueException);
    expect(t2).toThrow(Messages.INVALID_LESSON_NUMBER);
  });

  it("Fail when create a lesson without a name", () => {
    const t = () => {
      new Lesson(uuid(), uuid(), 1, "", true);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_LESSON_NAME);
  });

  it("Fail when activate a lesson already active", () => {
    const lesson = new Lesson(
      uuid(),
      uuid(),
      1,
      faker.name.jobDescriptor(),
      true
    );

    const t = () => {
      lesson.activate();
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.LESSON_ALREADY_ACTIVE);
  });

  it("Fail when inactivate a lesson already inactive", () => {
    const lesson = new Lesson(
      uuid(),
      uuid(),
      1,
      faker.name.jobDescriptor(),
      false
    );

    const t = () => {
      lesson.inactivate();
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.LESSON_ALREADY_INACTIVE);
  });

  it("Activate a lesson", () => {
    const lesson = new Lesson(
      uuid(),
      uuid(),
      1,
      faker.name.jobDescriptor(),
      false
    );

    lesson.activate();
    expect(lesson.active).toBe(true);
  });

  it("Inactivate a lesson", () => {
    const lesson = new Lesson(
      uuid(),
      uuid(),
      1,
      faker.name.jobDescriptor(),
      true
    );

    lesson.inactivate();
    expect(lesson.active).toBe(false);
  });
});
