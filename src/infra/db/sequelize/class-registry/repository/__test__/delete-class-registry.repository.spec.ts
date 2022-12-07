import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { ClassRegistry } from "@/domain/class-registry/entity";
import faker from "faker";
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

import { SequelizeDeleteClassRegistryRepository } from "../delete-class-registry.repository";
import { makeModels } from "./util";
describe("Sequelize Delete Class Registry Repository", () => {
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

  it("Fail trying delete a student class passing a wrong ID", async () => {
    const repository = new SequelizeDeleteClassRegistryRepository();
    const t = async () => {
      await repository.delete(faker.random.word());
    };
    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_ID);
  });
  it("Delete class registry", async () => {
    const { course, student1, student2, teacher1, teacher2, studentClass } =
      await makeModels();

    const createRepository = new SequelizeCreateClassRegistryRepository();
    const registry = new ClassRegistry({
      id: uuid(),
      studentClassId: studentClass.id,
      date: new Date(),
      teacherId: teacher1.id,
      studentIds: [student1.id],
      lessonIds: [course.lessons[0].id],
    });

    await createRepository.create(registry);

    const repository = new SequelizeDeleteClassRegistryRepository();
    await repository.delete(registry.id);

    let exists = await ClassRegistryModel.findOne({
      where: { id: registry.id },
    });
    expect(exists).toBeNull();
  });
});
