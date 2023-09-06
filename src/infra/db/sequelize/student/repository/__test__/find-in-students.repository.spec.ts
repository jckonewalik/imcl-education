import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { StudentModel } from "@/infra/db/sequelize/student/model";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { SequelizeFindInStudentsRepository } from "../find-in-students.repository";
import { makeStudent } from "./util";
describe("Sequelize Find In Students Repository", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([StudentModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Fail trying find students passing a wrong ID", async () => {
    const repository = new SequelizeFindInStudentsRepository();
    const t = async () => {
      await repository.find([faker.random.word()]);
    };
    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_ID);
  });

  it("Find students", async () => {
    const student1 = makeStudent({});
    const student2 = makeStudent({});
    await StudentModel.create({
      id: student1.id,
      studentClassId: student1.studentClassId,
      name: student1.name,
      gender: student1.gender.toString(),
      active: student1.active,
      phoneNumber: student1.phone?.number,
      phoneIsWhatsapp: student1.phone?.isWhatsapp,
    });
    await StudentModel.create({
      id: student2.id,
      studentClassId: student2.studentClassId,
      name: student2.name,
      gender: student2.gender.toString(),
      active: student2.active,
      phoneNumber: student2.phone?.number,
      phoneIsWhatsapp: student2.phone?.isWhatsapp,
    });

    const repository = new SequelizeFindInStudentsRepository();
    const foundStudents = await repository.find([student1.id, student2.id]);

    expect(foundStudents.length).toBe(2);
    expect(foundStudents.find((t) => t.id === student1.id)).toStrictEqual(
      student1
    );
    expect(foundStudents.find((t) => t.id === student2.id)).toStrictEqual(
      student2
    );
  });
});
