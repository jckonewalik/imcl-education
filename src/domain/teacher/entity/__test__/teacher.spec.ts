import { InvalidValueException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Teacher } from "../teacher";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { Gender } from "@/domain/@shared/enums/gender";
import { Email } from "@/domain/@shared/value-objects";

describe("Teacher Unit tests", () => {
  it("Fail creating a new Teacher without an ID", () => {
    const email = new Email(faker.internet.email());
    const t = () => {
      new Teacher("", faker.name.firstName(), Gender.F, email, true);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_TEACHER_ID);
  });

  it("Fail creating a new Teacher without a name", () => {
    const email = new Email(faker.internet.email());

    const t = () => {
      new Teacher(uuid(), "", Gender.F, email, true);
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_TEACHER_NAME);
  });

  it("Fail changing the name with an invalid name", () => {
    const email = new Email(faker.internet.email());
    const teacher = new Teacher(
      uuid(),
      faker.name.firstName(),
      Gender.F,
      email,
      true
    );

    const t = () => {
      teacher.changeName("");
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_TEACHER_NAME);
  });
});
