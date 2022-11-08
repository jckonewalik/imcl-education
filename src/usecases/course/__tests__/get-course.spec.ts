import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Course } from "@/domain/course/entity";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { GetCourseUseCase } from "../get-course";

type SutsProps = {
  courses?: Map<string, Course>;
};

type Suts = {
  sut: GetCourseUseCase;
};

const makeCourses = () => {
  const course1 = new Course(uuid(), faker.random.word(), true);
  course1.addLesson(1, faker.random.word());
  course1.addLesson(2, faker.random.word());

  const course2 = new Course(uuid(), faker.random.word(), true);

  const coursesMap = new Map<string, Course>();
  coursesMap.set(course1.id, course1);
  coursesMap.set(course2.id, course2);

  return { course1, course2, coursesMap };
};

const makeSuts = ({ courses }: SutsProps): Suts => {
  const repository = {
    find: async (id: string) => {
      return courses?.get(id);
    },
  };
  const sut = new GetCourseUseCase(repository);
  return { sut };
};

describe("Get Course Use Case", () => {
  it("Get a course by ID", async () => {
    const { course1, coursesMap } = makeCourses();
    const { sut } = makeSuts({ courses: coursesMap });

    const result = await sut.get(course1.id);

    expect(result.id).toBe(course1.id);
    expect(result.name).toBe(course1.name);
    expect(result.active).toBe(course1.active);
    expect(result.lessons.length).toBe(2);
  });

  it("Fail getting a invalid course", async () => {
    const { sut } = makeSuts({});

    const t = async () => {
      await sut.get(uuid());
    };

    await expect(t).rejects.toThrow(EntityNotFoundException);
    await expect(t).rejects.toThrow(Messages.INVALID_COURSE);
  });
});
