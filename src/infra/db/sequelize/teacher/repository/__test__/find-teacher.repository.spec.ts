import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
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

  it("Fail trying find a teacher passing a wrong ID", async () => {
    const repository = new SequelizeFindTeacherRepository();
    const t = async () => {
      await repository.find(faker.random.word());
    };
    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_ID);
  });

  it("Find teacher", async () => {
    const teacher = makeTeacher({});
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
