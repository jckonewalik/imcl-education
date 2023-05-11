import { StudentModel } from "@/infra/db/sequelize/student/model";
import { Sequelize } from "sequelize-typescript";
import { EnrollmentModel } from "../../../student-class/model";
import { SequelizeCreateStudentRepository } from "../create-student.repository";
import { makeStudent } from "./util";

describe("Sequelize Create Student Repository", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([StudentModel, EnrollmentModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Create a student", async () => {
    const repository = new SequelizeCreateStudentRepository();
    const student = makeStudent({});

    await repository.create(student);

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
    expect(studentModel?.updatedOn).toBeDefined();
  });
});
