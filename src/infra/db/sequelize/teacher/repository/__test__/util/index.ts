import { Teacher } from "@/domain/teacher/entity";
import { v4 as uuid } from "uuid";
import faker from "faker";
import { Email } from "@/domain/@shared/value-objects";
import { Gender } from "@/domain/@shared/enums/gender";

export const makeTeacher = (): Teacher => {
  const email = new Email(faker.internet.email());
  return new Teacher(
    uuid(),
    faker.name.firstName() + " " + faker.name.lastName(),
    Gender.M,
    email,
    true
  );
};
