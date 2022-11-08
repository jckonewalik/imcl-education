import { Course } from "@/domain/course/entity";
import { FindAllCoursesRepository } from "@/domain/course/repository";
import { CourseModel, LessonModel } from "@/infra/db/sequelize/course/model";
import { Sequelize } from "sequelize-typescript";
import { SequelizeFindAllCoursesRepository } from "../find-all-courses.repository";
import { makeCourse } from "./util";

type Sut = {
  courses: Course[];
  sut: FindAllCoursesRepository;
};

const makeSut = async (): Promise<Sut> => {
  const course1 = makeCourse({ active: false });
  const course2 = makeCourse({});

  await CourseModel.create({
    id: course1.id,
    name: course1.name,
    active: course1.active,
  });
  await CourseModel.create({
    id: course2.id,
    name: course2.name,
    active: course2.active,
  });

  const repository = new SequelizeFindAllCoursesRepository();

  return { courses: [course1, course2], sut: repository };
};
describe("Sequelize Find All Courses Repository", () => {
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

  it("Find course by name", async () => {
    const { courses, sut } = await makeSut();
    const result = await sut.find(
      { name: courses[0].name.substring(0, 5) },
      1,
      1
    );

    expect(result.currentPage).toBe(1);
    expect(result.totalItems).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.data[0].id).toStrictEqual(courses[0].id);
  });

  it("Find active courses", async () => {
    const { courses, sut } = await makeSut();
    const result = await sut.find({ active: true }, 2, 1);

    expect(result.currentPage).toBe(1);
    expect(result.totalItems).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.data[0].id).toStrictEqual(courses[1].id);
  });
});
