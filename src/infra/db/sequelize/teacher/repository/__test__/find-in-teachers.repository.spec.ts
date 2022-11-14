import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { SequelizeFindInTeachersRepository } from "../find-in-teachers.repository";
import { makeTeacher } from "./util";
describe("Sequelize Find In Teachers Repository", () => {
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

  it("Fail trying find teachers passing a wrong ID", async () => {
    const repository = new SequelizeFindInTeachersRepository();
    const t = async () => {
      await repository.find([faker.random.word()]);
    };
    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_ID);
  });

  it("Find teachers", async () => {
    const teacher1 = makeTeacher({});
    const teacher2 = makeTeacher({});
    await TeacherModel.create({
      id: teacher1.id,
      name: teacher1.name,
      gender: teacher1.gender.toString(),
      email: teacher1.email.value,
      active: teacher1.active,
    });
    await TeacherModel.create({
      id: teacher2.id,
      name: teacher2.name,
      gender: teacher2.gender.toString(),
      email: teacher2.email.value,
      active: teacher2.active,
    });

    const repository = new SequelizeFindInTeachersRepository();
    const foundTeachers = await repository.find([teacher1.id, teacher2.id]);

    expect(foundTeachers.length).toBe(2);
    expect(foundTeachers.find((t) => t.id === teacher1.id)).toStrictEqual(
      teacher1
    );
    expect(foundTeachers.find((t) => t.id === teacher2.id)).toStrictEqual(
      teacher2
    );
  });
});
