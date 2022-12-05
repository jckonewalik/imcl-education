import { DateUtils } from "@/domain/@shared/util/date-utils";
import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import { CourseModel, LessonModel } from "../../../course/model";
import {
  EnrollmentModel,
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
import { SequelizeFindClassRegitryByDateRepository } from "../find-class-registry-by-date.repository";
import { makeModels } from "./util";
describe("Sequelize Find Class Registry By Date Repository", () => {
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
      EnrollmentModel,
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

  it("Find a class registry by Date", async () => {
    const { student1, teacher1, studentClass } = await makeModels();

    const sut = new SequelizeFindClassRegitryByDateRepository();

    const date = new Date();

    const t = await ClassRegistryModel.sequelize?.transaction();
    const id = uuid();
    try {
      await ClassRegistryModel.create({
        id,
        studentClassId: studentClass.id,
        teacherId: teacher1.id,
        date,
      });
      await ClassRegistryStudentModel.create({
        classRegistryId: id,
        studentId: student1.id,
      });
      await t?.commit();
    } catch (error) {
      await t?.rollback();
    }

    let registry = await sut.find(studentClass.id, date);

    expect(registry).toBeDefined();
    expect(registry?.studentClassId).toBe(studentClass.id);
    expect(registry?.teacherId).toBe(teacher1.id);
    expect(registry?.date).toStrictEqual(DateUtils.toSimpleDate(date));

    date.setDate(date.getDate() - 1);
    registry = await sut.find(studentClass.id, date);

    expect(registry).not.toBeDefined();
  });
});
