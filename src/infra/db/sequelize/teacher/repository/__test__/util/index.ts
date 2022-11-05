import { Gender } from "@/domain/@shared/enums/gender";
import { Email } from "@/domain/@shared/value-objects";
import { Teacher } from "@/domain/teacher/entity";
import faker from "faker";
import { v4 as uuid } from "uuid";

export const makeTeacher = ({
  email = faker.internet.email(),
  gender = Gender.M,
  name = `${faker.name.firstName()} ${faker.name.lastName()}`,
  active = true,
}): Teacher => {
  return new Teacher(uuid(), name, gender, new Email(email), active);
};
