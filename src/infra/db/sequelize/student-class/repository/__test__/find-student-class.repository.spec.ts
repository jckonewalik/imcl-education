import { StudentClass } from "@/domain/student-class/entity";
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
import { SequelizeCreateStudentClassRepository } from "../create-student-class.repostitory";
import { SequelizeFindStudentClassRepository } from "../find-student-class.repository";
import { makeModels } from "./util";
describe("Sequelize Find Student Class Repository", () => {
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
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Find student class", async () => {
    const { course, student, teacher } = await makeModels();

    const createRepository = new SequelizeCreateStudentClassRepository();

    const studentClass = StudentClass.Builder.builder(
      uuid(),
      course.id,
      faker.random.word()
    ).build();
    studentClass.enrollStudent(student.toEntity());
    studentClass.addTeacher(teacher.toEntity());

    await createRepository.create(studentClass);

    const repository = new SequelizeFindStudentClassRepository();
    const foundClass = await repository.find(studentClass.id);

    expect(foundClass).toStrictEqual(studentClass);
  });
});