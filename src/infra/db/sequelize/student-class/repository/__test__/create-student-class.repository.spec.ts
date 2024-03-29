import { StudentClass } from "@/domain/student-class/entity";
import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import {
  StudentClassModel,
  StudentClassTeacherModel,
} from "@/infra/db/sequelize/student-class/model";
import { StudentModel } from "@/infra/db/sequelize/student/model";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import { SequelizeCreateStudentClassRepository } from "../create-student-class.repostitory";
import { makeModels } from "./util";

describe("Sequelize Create Student Class Repository", () => {
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
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Create a student class", async () => {
    const { course, teacher } = await makeModels();

    const repository = new SequelizeCreateStudentClassRepository();

    const studentClass = StudentClass.Builder.builder(
      uuid(),
      course.id,
      faker.random.word(),
      true
    )
      .year(2022)
      .build();
    studentClass.addTeacher(teacher.toEntity());

    await repository.create(studentClass);

    const studentClassModel = await StudentClassModel.findOne({
      where: { id: studentClass.id },
      include: ["teachers"],
    });

    expect(studentClassModel).not.toBeNull();
    expect(studentClassModel?.id).toBe(studentClass.id);
    expect(studentClassModel?.name).toBe(studentClass.name);
    expect(studentClassModel?.year).toBe(2022);
    expect(studentClassModel?.active).toBe(studentClass.active);
    expect(studentClassModel?.teachers?.length).toBe(1);
    expect(studentClassModel?.teachers?.[0].id).toBe(teacher.id);

    expect(studentClassModel?.creationDate).toBeDefined();
    expect(studentClassModel?.updatedOn).toBeDefined();
  });
});
