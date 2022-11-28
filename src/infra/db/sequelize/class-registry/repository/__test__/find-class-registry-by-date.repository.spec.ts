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
    const { student, teacher, studentClass } = await makeModels();

    const sut = new SequelizeFindClassRegitryByDateRepository();

    const date = new Date();

    const t = await ClassRegistryModel.sequelize?.transaction();
    const id = uuid();
    try {
      await ClassRegistryModel.create({
        id,
        studentClassId: studentClass.id,
        teacherId: teacher.id,
        date,
      });
      await ClassRegistryStudentModel.create({
        classRegistryId: id,
        studentId: student.id,
      });
      await t?.commit();
    } catch (error) {
      await t?.rollback();
    }

    let registry = await sut.find(studentClass.id, date);

    expect(registry).toBeDefined();
    expect(registry?.studentClassId).toBe(studentClass.id);
    expect(registry?.teacherId).toBe(teacher.id);
    expect(registry?.date).toBe(date.toISOString().split("T")[0]);

    date.setDate(date.getDate() - 1);
    registry = await sut.find(studentClass.id, date);

    expect(registry).not.toBeDefined();
  });
});