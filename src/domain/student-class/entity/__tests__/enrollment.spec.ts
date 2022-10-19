import { Enrollment } from "../enrollment";
import { v4 as uuid } from "uuid";
import { InvalidValueException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
describe("Enrollment Unit tests", () => {
  it("Fail creating a new enrollment without an ID", () => {
    const t = () => {
      new Enrollment("", uuid(), uuid());
    };

    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_ENROLLMENT_ID);
  });

  it("Fail creating a new enrollment without a class ID", () => {
    const t = () => {
      new Enrollment(uuid(), "", uuid());
    };

    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_CLASS_ID);
  });

  it("Fail creating a new enrollment without a student ID", () => {
    const t = () => {
      new Enrollment(uuid(), uuid(), "");
    };

    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_STUDENT_ID);
  });
});
