import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { SequelizeUpdateCourseRepository } from "../update-course.repository";
import { makeCourse } from "./util";
describe("Sequelize Update Course Repository", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CourseModel, LessonModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Update a course", async () => {
    const repository = new SequelizeUpdateCourseRepository();
    const course = makeCourse();
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

    const lessons = course.lessons;
    course.inactivate();
    course.removeLesson(lessons[1]);
    course.lessons[0].inactivate();
    course.addLesson(3, faker.random.word());

    await repository.update(course);

    const courseModel = await CourseModel.findOne({
      where: { id: course.id },
      include: "lessons",
    });

    expect(courseModel).toBeDefined();
    expect(courseModel?.id).toBe(course.id);
    expect(courseModel?.name).toBe(course.name);
    expect(courseModel?.active).toBe(course.active);
    expect(courseModel?.lessons.length).toBe(2);
    expect(courseModel?.lessons.filter((l) => l.active).length).toBe(1);
    expect(courseModel?.lessons.filter((l) => !l.active).length).toBe(1);
    expect(courseModel?.creationDate).toBeDefined();
    expect(courseModel?.updatedOn).not.toEqual(courseModel?.creationDate);
  });
});
