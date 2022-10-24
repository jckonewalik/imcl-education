import { Sequelize } from "sequelize-typescript";
import { TeacherModel } from "../../model/teacher.model";
import { SequelizeFindTeacherRepository } from "../find-teacher.repository";
import { makeTeacher } from "./util";
describe("Sequelize Find Teacher Repository", () => {
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

  it("Find teacher", async () => {
    const teacher = makeTeacher();
    await TeacherModel.create({
      id: teacher.id,
      name: teacher.name,
      gender: teacher.gender.toString(),
      email: teacher.email.value,
      active: teacher.active,
    });

    const repository = new SequelizeFindTeacherRepository();
    const foundTeacher = await repository.find(teacher.id);

    expect(foundTeacher).toStrictEqual(teacher);
  });
});
