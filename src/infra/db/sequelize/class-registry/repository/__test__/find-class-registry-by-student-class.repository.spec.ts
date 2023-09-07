import { BadRequestException } from "@/domain/@shared/exceptions";
import { DateUtils } from "@/domain/@shared/util/date-utils";
import Messages from "@/domain/@shared/util/messages";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import { CourseModel, LessonModel } from "../../../course/model";
import {
  StudentClassModel,
  StudentClassTeacherModel,
} from "../../../student-class/model";
import { StudentModel } from "../../../student/model";
import { TeacherModel } from "../../../teacher/model";
import {
  ClassRegistryLessonModel,
  ClassRegistryModel,
  ClassRegistryStudentModel,
} from "../../model";
import { SequelizeFindClassRegitryByStudentClassRepository } from "../find-class-registry-by-student-class.repository";
import { makeModels } from "./util";
describe("Sequelize Find Class Registry By Student Class Repository", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      StudentClassModel,
      CourseModel,
      StudentClassTeacherModel,
      TeacherModel,
      LessonModel,
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

  it("Fail trying find a registry passing a wrong student Class ID", async () => {
    const repository = new SequelizeFindClassRegitryByStudentClassRepository();
    const t = async () => {
      await repository.find(faker.random.word());
    };
    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_ID);
  });

  it("Find a class registry by student class", async () => {
    const { student1, student2, teacher1, studentClass } = await makeModels();

    const sut = new SequelizeFindClassRegitryByStudentClassRepository();

    const date1 = new Date();
    const date2 = new Date();
    date2.setDate(date2.getDate() - 1);

    const t = await ClassRegistryModel.sequelize?.transaction();
    const id1 = uuid();
    const id2 = uuid();
    try {
      await ClassRegistryModel.create({
        id: id1,
        studentClassId: studentClass.id,
        teacherId: teacher1.id,
        date: date1,
      });
      await ClassRegistryStudentModel.create({
        classRegistryId: id1,
        studentId: student1.id,
      });
      await ClassRegistryModel.create({
        id: id2,
        studentClassId: studentClass.id,
        teacherId: teacher1.id,
        date: date2,
      });
      await ClassRegistryStudentModel.create({
        classRegistryId: id2,
        studentId: student2.id,
      });
      await t?.commit();
    } catch (error) {
      await t?.rollback();
    }

    let registries = await sut.find(studentClass.id);

    expect(registries.length).toBe(2);
    expect(registries[0].studentClassId).toBe(studentClass.id);
    expect(registries[0].teacherId).toBe(teacher1.id);
    expect(registries[0].date).toStrictEqual(DateUtils.toSimpleDate(date1));
    expect(registries[1].date).toStrictEqual(DateUtils.toSimpleDate(date2));
  });
});
