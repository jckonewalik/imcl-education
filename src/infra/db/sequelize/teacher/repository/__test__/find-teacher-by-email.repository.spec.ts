import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import { Sequelize } from "sequelize-typescript";
import { SequelizeFindTeacherByEmailRepository } from "../find-teacher-by-email.repository";
import { makeTeacher } from "./util";
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
    const teacher = makeTeacher();
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
