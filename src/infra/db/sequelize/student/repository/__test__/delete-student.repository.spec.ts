import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import { makeCourse } from "@/infra/db/sequelize/course/repository/__test__/util";
import {
  EnrollmentModel,
  StudentClassModel,
  StudentClassTeacherModel,
} from "@/infra/db/sequelize/student-class/model";
import { TeacherModel } from "@/infra/db/sequelize/teacher/model";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import { StudentModel } from "../../model";
import { SequelizeDeleteStudentRepository } from "../delete-student.repository";
import { makeStudent } from "./util";
describe("Sequelize Delete Student Repository", () => {
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
      StudentClassModel,
      EnrollmentModel,
      StudentClassTeacherModel,
      TeacherModel,
      StudentModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Fail trying delete a student passing a wrong ID", async () => {
    const repository = new SequelizeDeleteStudentRepository();
    const t = async () => {
      await repository.delete(faker.random.word());
    };
    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_ID);
  });
  it("Delete student", async () => {
    const student = makeStudent({});
    await StudentModel.create({
      id: student.id,
      name: student.name,
      active: student.active,
    });

    let exists = await StudentModel.findOne({ where: { id: student.id } });
    expect(exists).not.toBeNull();

    const repository = new SequelizeDeleteStudentRepository();
    await repository.delete(student.id);

    exists = await StudentModel.findOne({ where: { id: student.id } });
    expect(exists).toBeNull();
  });

  it("Fail Deleting a student enrolled in a student class", async () => {
    const student = makeStudent({});
    await StudentModel.create({
      id: student.id,
      name: student.name,
      active: student.active,
    });
    const course = makeCourse({});
    await CourseModel.create(
      {
        id: course.id,
        name: course.name,
        active: course.active,
        lessons: course.lessons.map((l) => ({
          id: l.id,
          courseId: l.courseId,
          number: l.number,
          name: l.name,
          active: l.active,
        })),
      },
      { include: "lessons" }
    );
    const studentClassId = uuid();
    await StudentClassModel.create(
      {
        id: studentClassId,
        courseId: course.id,
        name: faker.random.word(),
        active: true,
        enrollments: [
          {
            id: uuid(),
            studentClassId: studentClassId,
            studentId: student.id,
          },
        ],
      },
      {
        include: "enrollments",
      }
    );

    let exists = await StudentModel.findOne({ where: { id: student.id } });
    expect(exists).not.toBeNull();

    const repository = new SequelizeDeleteStudentRepository();
    const t = async () => {
      await repository.delete(student.id);
    };
    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.STUDENT_ENROLLED);
  });
});
