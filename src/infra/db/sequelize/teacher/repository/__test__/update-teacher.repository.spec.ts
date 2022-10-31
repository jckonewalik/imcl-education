import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import { Sequelize } from "sequelize-typescript";
import { SequelizeUpdateTeacherRepository } from "../update-teacher.repository";
import { makeTeacher } from "./util";

describe("Sequelize Update Teacher Repository", () => {
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

  it("Update a teacher", async () => {
    const repository = new SequelizeUpdateTeacherRepository();
    const teacher = makeTeacher();
    await TeacherModel.create({
      id: teacher.id,
      name: teacher.name,
      gender: teacher.gender.toString(),
      email: teacher.email.value,
      active: teacher.active,
    });

    teacher.inactivate();
    await repository.update(teacher);

    const teacherModel = await TeacherModel.findOne({
      where: { id: teacher.id },
    });

    expect(teacherModel).toBeDefined();
    expect(teacherModel?.id).toBe(teacher.id);
    expect(teacherModel?.name).toBe(teacher.name);
    expect(teacherModel?.gender).toBe(teacher.gender.toString());
    expect(teacherModel?.email).toBe(teacher.email.value);
    expect(teacherModel?.active).toBe(teacher.active);
    expect(teacherModel?.creationDate).toBeDefined();
    expect(teacherModel?.updatedOn).not.toEqual(teacherModel?.creationDate);
  });
});
