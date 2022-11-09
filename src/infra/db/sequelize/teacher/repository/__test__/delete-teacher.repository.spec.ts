import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import { Sequelize } from "sequelize-typescript";
import { SequelizeDeleteTeacherRepository } from "../delete-teacher.repository";
import { makeTeacher } from "./util";
describe("Sequelize Delete Teacher Repository", () => {
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

  it("Delete teacher", async () => {
    const teacher = makeTeacher({});
    await TeacherModel.create({
      id: teacher.id,
      name: teacher.name,
      gender: teacher.gender.toString(),
      email: teacher.email.value,
      active: teacher.active,
    });

    const repository = new SequelizeDeleteTeacherRepository();
    await repository.delete(teacher.id);

    const exists = await TeacherModel.findOne({ where: { id: teacher.id } });

    expect(exists).toBeNull();
  });
});
