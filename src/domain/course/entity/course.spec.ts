import InvalidValueException from "../../exceptions/invalid-value-exception";
import Messages from "../../util/messages";
import Course from "./course";
import faker from "faker";
import { v4 as uuid } from "uuid";
import BadRequestException from "../../exceptions/bad-request-exception";

describe("Course Unit tests", () => {
  it("Fail when create a course without an ID", () => {
    const t = () => {
      new Course("", faker.name.jobArea(), true);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_COURSE_ID);
  });

  it("Fail when create a course without a name", () => {
    const t = () => {
      new Course(uuid(), "", true);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_COURSE_NAME);
  });

  it("Fail when activate a course already active", () => {
    const course = new Course(uuid(), faker.name.jobArea(), true);

    const t = () => {
      course.activate();
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.COURSE_ALREADY_ACTIVE);
  });

  it("Fail when inactivate a course already inactive", () => {
    const course = new Course(uuid(), faker.name.jobArea(), false);

    const t = () => {
      course.inactivate();
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.COURSE_ALREADY_INACTIVE);
  });

  it("Activate a course", () => {
    const course = new Course(uuid(), faker.name.jobArea(), false);

    course.activate();
    expect(course.active).toBe(true);
  });

  it("Inactivate a course", () => {
    const course = new Course(uuid(), faker.name.jobArea(), true);

    course.inactivate();
    expect(course.active).toBe(false);
  });
});
