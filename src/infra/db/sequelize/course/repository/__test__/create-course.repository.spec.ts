import { Course } from "@/domain/course/entity";
import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import { SequelizeCreateCourseRepository } from "../create-course.repository";
describe("Sequelize Create Course Repository", () => {
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

  it("Create a course with lessons", async () => {
    const repository = new SequelizeCreateCourseRepository();
    const course = new Course(uuid(), faker.random.word(), true);
    course.addLesson(1, faker.random.word());

    await repository.create(course);

    const courseModel = await CourseModel.findOne({
      where: { id: course.id },
      include: "lessons",
    });

    expect(courseModel).toBeDefined();
    expect(courseModel?.id).toBe(course.id);
    expect(courseModel?.name).toBe(course.name);
    expect(courseModel?.lessons.length).toBe(1);
    expect(courseModel?.lessons[0].id).toBe(course.lessons[0].id);
    expect(courseModel?.lessons[0].number).toBe(course.lessons[0].number);
    expect(courseModel?.lessons[0].name).toBe(course.lessons[0].name);
    expect(courseModel?.lessons[0].active).toBe(course.lessons[0].active);
    expect(courseModel?.creationDate).toBeDefined();
    expect(courseModel?.updatedOn).toBeDefined();
  });
});
