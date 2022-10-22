import {
  BadRequestException,
  InvalidValueException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Teacher } from "../teacher";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { Gender } from "@/domain/@shared/enums/gender";
import { Email } from "@/domain/@shared/value-objects";

const makeTeacher = ({
  id = uuid(),
  name = faker.name.firstName(),
  gender = Gender.M,
  email = faker.internet.email(),
  active = true,
}): Teacher => {
  const teacher = new Teacher(id, name, gender, new Email(email), active);
  return teacher;
};

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
    const teacher = makeTeacher({});

    const t = () => {
      teacher.changeName("");
    };
    expect(t).toThrow(InvalidValueException);
    expect(t).toThrow(Messages.MISSING_TEACHER_NAME);
  });

  it("Change teacher's name", () => {
    const teacher = makeTeacher({});
    const newName = faker.name.firstName();
    teacher.changeName(newName);
    expect(teacher.name).toBe(newName);
  });

  it("Fail when activate a teacher already active", () => {
    const teacher = makeTeacher({});
    const t = () => {
      teacher.activate();
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.TEACHER_ALREADY_ACTIVE);
  });

  it("Fail when inactivate a teacher already inactive", () => {
    const teacher = makeTeacher({ active: false });

    const t = () => {
      teacher.inactivate();
    };
    expect(t).toThrow(BadRequestException);
    expect(t).toThrow(Messages.TEACHER_ALREADY_INACTIVE);
  });

  it("Activate teacher", () => {
    const teacher = makeTeacher({ active: false });

    teacher.activate();
    expect(teacher.active).toBe(true);
  });

  it("Inactivate teacher", () => {
    const teacher = makeTeacher({ active: true });

    teacher.inactivate();
    expect(teacher.active).toBe(false);
  });
});
