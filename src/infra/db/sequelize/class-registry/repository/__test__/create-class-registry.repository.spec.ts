import { ClassRegistry } from "@/domain/class-registry/entity";
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
import { SequelizeCreateClassRegistryRepository } from "../create-class-registry.repostitory";
import { makeModels } from "./util";
describe("Sequelize Create Class Registry Repository", () => {
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

  it("Create a class registry", async () => {
    const { course, student1, teacher1, studentClass } = await makeModels();

    const repository = new SequelizeCreateClassRegistryRepository();

    const registry = new ClassRegistry(
      uuid(),
      studentClass.id,
      new Date(),
      teacher1.id,
      [student1.id],
      [course.lessons[0].id]
    );

    await repository.create(registry);

    const registryModel = await ClassRegistryModel.findOne({
      where: { id: registry.id },
      include: ["students", "lessons"],
    });

    expect(registryModel).not.toBeNull();
    expect(registryModel?.id).toBe(registry.id);
    expect(registryModel?.studentClassId).toBe(registry.studentClassId);
    expect(registryModel?.teacherId).toBe(registry.teacherId);
    expect(registryModel?.date).toStrictEqual(
      registry.date.toISOString().split("T")[0]
    );
    expect(registryModel?.students.length).toBe(1);
    expect(registryModel?.students[0].id).toBe(student1.id);

    expect(registryModel?.lessons.length).toBe(1);
    expect(registryModel?.lessons[0].id).toBe(course.lessons[0].id);

    expect(registryModel?.creationDate).toBeDefined();
    expect(registryModel?.updatedOn).toBeDefined();
  });
});
