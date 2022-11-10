import { StudentModel } from "@/infra/db/sequelize/student/model";
import { Sequelize } from "sequelize-typescript";
import { SequelizeFindStudentRepository } from "../find-student.repository";
import { makeStudent } from "./util";
describe("Sequelize Find Student Repository", () => {
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

  it("Find student", async () => {
    const student1 = makeStudent({});
    const student2 = makeStudent({});
    student2.changePhone(undefined);

    await StudentModel.create({
      id: student1.id,
      name: student1.name,
      gender: student1.gender.toString(),
      phoneNumber: student1.phone?.number,
      phoneIsWhatsapp: student1.phone?.isWhatsapp,
      active: student1.active,
    });

    await StudentModel.create({
      id: student2.id,
      name: student2.name,
      gender: student2.gender.toString(),
      phoneNumber: student2.phone?.number,
      phoneIsWhatsapp: student2.phone?.isWhatsapp,
      active: student2.active,
    });

    const repository = new SequelizeFindStudentRepository();
    const foundStudent1 = await repository.find(student1.id);
    const foundStudent2 = await repository.find(student2.id);

    expect(foundStudent1).toStrictEqual(student1);
    expect(foundStudent2).toStrictEqual(student2);
  });
});
