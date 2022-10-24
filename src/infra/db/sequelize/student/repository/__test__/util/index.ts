import { PhoneNumber } from "@/domain/@shared/value-objects";
import { Student } from "@/domain/student/entity/student";
import { v4 as uuid } from "uuid";
import faker from "faker";
import { Gender } from "@/domain/@shared/enums/gender";
export const makeStudent = (): Student => {
  const phone = new PhoneNumber("9999999999", true);
  return new Student(
    uuid(),
    faker.name.firstName() + " " + faker.name.lastName(),
    Gender.M,
    true,
    phone
  );
};
