import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { SequelizeFindCourseRepository } from "../find-course.repository";
import { makeCourse } from "./util";

describe("Sequelize Find Course Repository", () => {
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

  it("Fail trying find a course passing a wrong ID", async () => {
    const repository = new SequelizeFindCourseRepository();
    const t = async () => {
      await repository.find(faker.random.word());
    };
    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_ID);
  });
  it("Find course", async () => {
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

    const repository = new SequelizeFindCourseRepository();
    const foundCourse = await repository.find(course.id);

    expect(foundCourse).toStrictEqual(course);
  });
});
