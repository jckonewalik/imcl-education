import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { ClassRegistry } from "@/domain/class-registry/entity";
import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import {
  EnrollmentModel,
  StudentClassModel,
  StudentClassTeacherModel,
} from "@/infra/db/sequelize/student-class/model";
import { StudentModel } from "@/infra/db/sequelize/student/model";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import {
  ClassRegistryLessonModel,
  ClassRegistryModel,
  ClassRegistryStudentModel,
} from "../../model";
import { SequelizeCreateClassRegistryRepository } from "../create-class-registry.repostitory";
import { SequelizeFindClassRegistryRepository } from "../find-class-registry.repository";
import { makeModels } from "./util";
describe("Sequelize Find Class Registry Repository", () => {
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
      TeacherModel,
      StudentModel,
      EnrollmentModel,
      StudentClassModel,
      StudentClassTeacherModel,
      ClassRegistryModel,
      ClassRegistryStudentModel,
      ClassRegistryLessonModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Fail trying find a registry passing a wrong ID", async () => {
    const repository = new SequelizeFindClassRegistryRepository();
    const t = async () => {
      await repository.find(faker.random.word());
    };
    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_ID);
  });

  it("Find class registry", async () => {
    const { course, student1, teacher1, studentClass } = await makeModels();

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

    const repository = new SequelizeFindClassRegistryRepository();
    const foundRegistry = await repository.find(registry.id);

    expect(foundRegistry).toStrictEqual(registry);
  });
});
