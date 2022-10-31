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
import { SequelizeUpdateStudentClassRepository } from "../update-student-class.repository";
import { makeModels } from "./util";
describe("Sequelize Update Student Class Repository", () => {
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

  it("Update a student class", async () => {
    const { course, student: student1, teacher: teacher1 } = await makeModels();
    const { student: student2, teacher: teacher2 } = await makeModels();
    const { student: student3, teacher: teacher3 } = await makeModels();

    const createRepository = new SequelizeCreateStudentClassRepository();

    const studentClass = StudentClass.Builder.builder(
      uuid(),
      course.id,
      faker.random.word()
    ).build();
    studentClass.enrollStudent(student1.toEntity());
    studentClass.addTeacher(teacher1.toEntity());

    await createRepository.create(studentClass);

    const repository = new SequelizeUpdateStudentClassRepository();

    const newName = faker.random.word();
    studentClass.changeName(newName);
    studentClass.unenrollStudent(student1.toEntity());
    studentClass.removeTeacher(teacher1.toEntity());
    studentClass.enrollStudent(student2.toEntity());
    studentClass.addTeacher(teacher2.toEntity());
    studentClass.enrollStudent(student3.toEntity());
    studentClass.addTeacher(teacher3.toEntity());

    await repository.update(studentClass);

    const studentClassModel = await StudentClassModel.findOne({
      where: { id: studentClass.id },
      include: ["enrollments", "teachers"],
    });

    expect(studentClassModel).not.toBeNull();
    expect(studentClassModel?.id).toBe(studentClass.id);
    expect(studentClassModel?.name).toBe(newName);
    expect(studentClassModel?.active).toBe(studentClass.active);
    expect(studentClassModel?.enrollments?.length).toBe(2);
    expect(
      studentClassModel?.enrollments?.filter((e) => e.studentId == student1.id)
        .length
    ).toBe(0);

    expect(studentClassModel?.teachers?.length).toBe(2);
    expect(
      studentClassModel?.teachers?.filter(
        (teacher) => teacher.id == teacher1.id
      ).length
    ).toBe(0);

    expect(studentClassModel?.creationDate).toBeDefined();
    expect(studentClassModel?.updatedOn).not.toEqual(
      studentClassModel?.creationDate
    );
  });
});
