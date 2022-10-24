import { Email } from "@/domain/@shared/value-objects";
import { Sequelize } from "sequelize-typescript";
import { TeacherModel } from "../../model/teacher.model";
import { v4 as uuid } from "uuid";
import faker from "faker";
import { Teacher } from "@/domain/teacher/entity";
import { Gender } from "@/domain/@shared/enums/gender";
import { SequelizeFindTeacherByEmailRepository } from "../find-teacher-by-email.repository";
describe("Sequelize Find Teacher by Email Repository", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([TeacherModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Find teacher by email", async () => {
    const email = new Email(faker.internet.email());
    const teacher = new Teacher(
      uuid(),
      faker.name.firstName() + " " + faker.name.lastName(),
      Gender.M,
      email,
      true
    );
    await TeacherModel.create({
      id: teacher.id,
      name: teacher.name,
      gender: teacher.gender.toString(),
      email: teacher.email.value,
      active: teacher.active,
    });

    const repository = new SequelizeFindTeacherByEmailRepository();
    const foundTeacher = await repository.find(teacher.email);

    expect(foundTeacher).toStrictEqual(teacher);
  });
});
