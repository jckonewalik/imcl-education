import { StudentClass } from "@/domain/student-class/entity";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import { CourseModel, LessonModel } from "../../../course/model";
import { StudentModel } from "../../../student/model/student.model";
import { TeacherModel } from "../../../teacher/model/teacher.model";
import {
  EnrollmentModel,
  StudentClassModel,
  StudentClassTeacherModel,
} from "../../model";
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
