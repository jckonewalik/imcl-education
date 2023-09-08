import { Gender } from "@/domain/@shared/enums/gender";
import { CourseModel } from "@/infra/db/sequelize/course/model";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import faker from "faker";
import { v4 as uuid } from "uuid";

export const makeModels = async () => {
  const course = await CourseModel.create({
    id: uuid(),
    name: faker.random.word(),
    active: true,
  });

  const teacher = await TeacherModel.create({
    id: uuid(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    gender: Gender.F,
    email: faker.internet.email(),
    active: true,
  });

  return { course, teacher };
};
