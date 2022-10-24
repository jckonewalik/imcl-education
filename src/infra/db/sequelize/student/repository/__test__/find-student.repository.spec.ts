import { Sequelize } from "sequelize-typescript";
import { StudentModel } from "../../model/student.model";
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
    const student = makeStudent();
    await StudentModel.create({
      id: student.id,
      name: student.name,
      gender: student.gender.toString(),
      phoneNumber: student.phone?.number,
      phoneIsWhatsapp: student.phone?.isWhatsapp,
      active: student.active,
    });

    const repository = new SequelizeFindStudentRepository();
    const foundStudent = await repository.find(student.id);

    expect(foundStudent).toStrictEqual(student);
  });
});
