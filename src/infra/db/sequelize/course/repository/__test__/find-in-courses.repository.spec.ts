import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import faker from "faker";
import { Sequelize } from "sequelize-typescript";
import { SequelizeFindInCoursesRepository } from "../find-in-courses.repository";
import { makeCourse } from "./util";
describe("Sequelize Find In Courses Repository", () => {
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

  it("Fail trying find courses passing a wrong ID", async () => {
    const repository = new SequelizeFindInCoursesRepository();
    const t = async () => {
      await repository.find([faker.random.word()]);
    };
    expect(t).rejects.toThrow(BadRequestException);
    expect(t).rejects.toThrow(Messages.INVALID_ID);
  });

  it("Find courses", async () => {
    const course1 = makeCourse({});
    const course2 = makeCourse({});
    await CourseModel.create(
      {
        id: course1.id,
        name: course1.name,
        active: course1.active,
        lessons: course1.lessons.map((l) => ({
          id: l.id,
          courseId: l.courseId,
          number: l.number,
          name: l.name,
          active: l.active,
        })),
      },
      { include: "lessons" }
    );
    await CourseModel.create(
      {
        id: course2.id,
        name: course2.name,
        active: course2.active,
        lessons: course2.lessons.map((l) => ({
          id: l.id,
          courseId: l.courseId,
          number: l.number,
          name: l.name,
          active: l.active,
        })),
      },
      { include: "lessons" }
    );

    const repository = new SequelizeFindInCoursesRepository();
    const foundCourses = await repository.find([course1.id, course2.id]);

    expect(foundCourses.length).toBe(2);
    expect(foundCourses.find((t) => t.id === course1.id)).toBeDefined();
    expect(foundCourses.find((t) => t.id === course2.id)).toBeDefined();
  });
});
