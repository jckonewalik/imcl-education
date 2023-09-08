import { DateUtils } from "@/domain/@shared/util/date-utils";
import { ClassRegistry } from "@/domain/class-registry/entity";
import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import {
  StudentClassModel,
  StudentClassTeacherModel,
} from "@/infra/db/sequelize/student-class/model";
import { StudentModel } from "@/infra/db/sequelize/student/model";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import {
  ClassRegistryLessonModel,
  ClassRegistryModel,
  ClassRegistryStudentModel,
} from "../../model";
import { SequelizeCreateClassRegistryRepository } from "../create-class-registry.repostitory";
import { SequelizeUpdateClassRegistryRepository } from "../update-class-registry.repository";
import { makeModels } from "./util";
describe("Sequelize Update Class Registry Repository", () => {
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

  it("Update a class registry", async () => {
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

    const repository = new SequelizeUpdateClassRegistryRepository();

    const newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);

    registry.updateDate(newDate);
    registry.updateTeacher(teacher2.id);
    registry.removeLesson(course.lessons[0].toEntity());
    registry.addLesson(course.lessons[1].toEntity());
    registry.addStudent(student2.toEntity());
    registry.removeStudent(student1.toEntity());

    await repository.update(registry);

    const registryModel = await ClassRegistryModel.findOne({
      where: { id: registry.id },
      include: ["lessons", "students"],
    });

    expect(registryModel).not.toBeNull();
    expect(registryModel?.id).toBe(registry.id);
    expect(DateUtils.toSimpleDate(registryModel!.date)).toStrictEqual(
      DateUtils.toSimpleDate(newDate)
    );
    expect(registryModel?.teacherId).toBe(registry.teacherId);
    expect(registryModel?.students?.length).toBe(1);
    expect(
      registryModel?.students?.filter((student) => student.id == student1.id)
        .length
    ).toBe(0);
    expect(
      registryModel?.students?.filter((student) => student.id == student2.id)
        .length
    ).toBe(1);

    expect(registryModel?.lessons?.length).toBe(1);
    expect(
      registryModel?.lessons?.filter(
        (lesson) => lesson.id == course.lessons[0].id
      ).length
    ).toBe(0);
    expect(
      registryModel?.lessons?.filter(
        (lesson) => lesson.id == course.lessons[1].id
      ).length
    ).toBe(1);

    expect(registryModel?.creationDate).toBeDefined();
    expect(registryModel?.updatedOn).not.toEqual(registryModel?.creationDate);
  });
});
