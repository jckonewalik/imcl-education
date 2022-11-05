import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import { Sequelize } from "sequelize-typescript";
import { SequelizeCreateTeacherRepository } from "../create-teacher.repository";
import { makeTeacher } from "./util";

describe("Sequelize Create Teacher Repository", () => {
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

  it("Create a teacher", async () => {
    const repository = new SequelizeCreateTeacherRepository();
    const teacher = makeTeacher({});

    await repository.create(teacher);

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
    expect(teacherModel?.updatedOn).toBeDefined();
  });
});
