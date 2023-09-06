import { Gender } from "@/domain/@shared/enums/gender";
import { PhoneNumber } from "@/domain/@shared/value-objects";
import { Student } from "@/domain/student/entity/student";
import faker from "faker";
import { v4 as uuid } from "uuid";
export const makeStudent = ({
  name = faker.name.firstName() + " " + faker.name.lastName(),
  gender = Gender.M,
  active = true,
  withPhone = true,
  studentClassId = faker.datatype.uuid(),
}): Student => {
  let phone: PhoneNumber | undefined;
  if (withPhone) {
    phone = new PhoneNumber("9999999999", true);
  }
  return new Student({ id: uuid(), name, gender, active, phone, studentClassId });
};
