import { Gender } from "@/domain/@shared/enums/gender";
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
      EnrollmentModel,
      StudentClassModel,
      StudentClassTeacherModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Create a student class", async () => {
    const repository = new SequelizeCreateStudentClassRepository();

    const course = await CourseModel.create({
      id: uuid(),
      name: faker.random.word(),
      active: true,
    });

    const teacher = await TeacherModel.create({
      id: uuid(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      gender: Gender.F,
      email: faker.internet.email(),
      active: true,
    });

    const student = await StudentModel.create({
      id: uuid(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      gender: Gender.M,
      active: true,
    });

    const studentClass = StudentClass.Builder.builder(
      uuid(),
      course.id,
      faker.random.word()
    ).build();
    studentClass.enrollStudent(student.toEntity());
    studentClass.addTeacher(teacher.toEntity());

    await repository.create(studentClass);

    const studentClassModel = await StudentClassModel.findOne({
      where: { id: studentClass.id },
      include: ["enrollments", "teachers"],
    });

    expect(studentClassModel).not.toBeNull();
    expect(studentClassModel?.id).toBe(studentClass.id);
    expect(studentClassModel?.name).toBe(studentClass.name);
    expect(studentClassModel?.active).toBe(studentClass.active);
    expect(studentClassModel?.enrollments?.length).toBe(1);
    expect(studentClassModel?.teachers?.length).toBe(1);
    expect(studentClassModel?.creationDate).toBeDefined();
    expect(studentClassModel?.updatedOn).toBeDefined();
  });
});
