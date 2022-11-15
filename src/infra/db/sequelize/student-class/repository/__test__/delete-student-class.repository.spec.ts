import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { CourseModel, LessonModel } from "../../../course/model";
import { StudentModel } from "../../../student/model";
import { TeacherModel } from "../../../teacher/model";
import {
  EnrollmentModel,
  StudentClassModel,
  StudentClassTeacherModel,
} from "../../model";
import { SequelizeDeleteStudentClassRepository } from "../delete-student-class.repository";
import { makeModels } from "./util";

describe("Sequelize Delete Student Class Repository", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CourseModel,
      LessonModel,
      StudentClassModel,
      EnrollmentModel,
      StudentClassTeacherModel,
      TeacherModel,
      StudentModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Fail trying delete a student class passing a wrong ID", async () => {
    const repository = new SequelizeDeleteStudentClassRepository();
    const t = async () => {
      await repository.delete(faker.random.word());
    };
    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_ID);
  });
  it("Delete student class", async () => {
    const { studentClass } = await makeModels();
    let exists = await StudentClassModel.findOne({
      where: { id: studentClass.id },
    });
    expect(exists).not.toBeNull();

    const repository = new SequelizeDeleteStudentClassRepository();
    await repository.delete(studentClass.id);

    exists = await StudentClassModel.findOne({
      where: { id: studentClass.id },
    });
    expect(exists).toBeNull();
  });
});
