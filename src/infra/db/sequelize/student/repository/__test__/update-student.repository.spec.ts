import { Sequelize } from "sequelize-typescript";
import { StudentModel } from "../../model/student.model";
import { SequelizeUpdateStudentRepository } from "../update-student.repository";
import { makeStudent } from "./util";

describe("Sequelize Update Student Repository", () => {
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

  it("Update a student", async () => {
    const repository = new SequelizeUpdateStudentRepository();
    const student = makeStudent();
    await StudentModel.create({
      id: student.id,
      name: student.name,
      gender: student.gender.toString(),
      phoneNumber: student.phone?.number,
      phoneIsWhatsapp: student.phone?.isWhatsapp,
      active: student.active,
    });

    student.inactivate();
    await repository.update(student);

    const studentModel = await StudentModel.findOne({
      where: { id: student.id },
    });

    expect(studentModel).toBeDefined();
    expect(studentModel?.id).toBe(student.id);
    expect(studentModel?.name).toBe(student.name);
    expect(studentModel?.gender).toBe(student.gender.toString());
    expect(studentModel?.phoneNumber).toBe(student.phone?.number);
    expect(studentModel?.phoneIsWhatsapp).toBe(student.phone?.isWhatsapp);
    expect(studentModel?.active).toBe(student.active);
    expect(studentModel?.creationDate).toBeDefined();
    expect(studentModel?.updatedOn).not.toEqual(studentModel?.creationDate);
  });
});
