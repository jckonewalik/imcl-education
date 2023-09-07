import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import {
  StudentClassModel,
  StudentClassTeacherModel,
} from "@/infra/db/sequelize/student-class/model";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import {
  ClassRegistryLessonModel,
  ClassRegistryModel,
  ClassRegistryStudentModel,
} from "../../../class-registry/model";
import { StudentModel } from "../../model";
import { SequelizeDeleteStudentRepository } from "../delete-student.repository";
import { makeStudent } from "./util";
describe("Sequelize Delete Student Repository", () => {
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
      StudentClassTeacherModel,
      TeacherModel,
      StudentModel,
      ClassRegistryModel,
      ClassRegistryStudentModel,
      ClassRegistryLessonModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Fail trying delete a student passing a wrong ID", async () => {
    const repository = new SequelizeDeleteStudentRepository();
    const t = async () => {
      await repository.delete(faker.random.word());
    };
    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_ID);
  });
  it("Delete student", async () => {
    const student = makeStudent({});
    await StudentModel.create({
      id: student.id,
      name: student.name,
      active: student.active,
    });

    let exists = await StudentModel.findOne({ where: { id: student.id } });
    expect(exists).not.toBeNull();

    const repository = new SequelizeDeleteStudentRepository();
    await repository.delete(student.id);

    exists = await StudentModel.findOne({ where: { id: student.id } });
    expect(exists).toBeNull();
  });
});
