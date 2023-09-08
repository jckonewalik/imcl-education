import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import {
  StudentClassModel,
  StudentClassTeacherModel,
} from "../../../student-class/model";
import { StudentModel } from "../../../student/model";
import { TeacherModel } from "../../../teacher/model";
import { CourseModel, LessonModel } from "../../model";
import { SequelizeDeleteCourseRepository } from "../delete-course.repository";
import { makeCourse } from "./util";
describe("Sequelize Delete Course Repository", () => {
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
      StudentClassTeacherModel,
      TeacherModel,
      StudentModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Fail trying delete a course passing a wrong ID", async () => {
    const repository = new SequelizeDeleteCourseRepository();
    const t = async () => {
      await repository.delete(faker.random.word());
    };
    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_ID);
  });
  it("Delete course", async () => {
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

    let exists = await CourseModel.findOne({ where: { id: course.id } });
    expect(exists).not.toBeNull();

    const repository = new SequelizeDeleteCourseRepository();
    await repository.delete(course.id);

    exists = await CourseModel.findOne({ where: { id: course.id } });
    expect(exists).toBeNull();
  });

  it("Fail Deleting a course associated with a student class", async () => {
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
    await StudentClassModel.create({
      id: uuid(),
      courseId: course.id,
      name: faker.random.word(),
      active: true,
    });

    let exists = await CourseModel.findOne({ where: { id: course.id } });
    expect(exists).not.toBeNull();

    const repository = new SequelizeDeleteCourseRepository();
    const t = async () => {
      await repository.delete(course.id);
    };
    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.COURSE_IN_USE);
  });
});
