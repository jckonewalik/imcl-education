import { Course } from "@/domain/course/entity";
import { v4 as uuid } from "uuid";
import faker from "faker";
import { UpdateCourseUseCase } from "../update-course";
import {
  FindCourseRepository,
  UpdateCourseRepository,
} from "@/domain/course/repository/course.repository";
import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { UpdateAction } from "@/usecases/@shared/enums";

type SutsProps = {
  course?: Course;
};
type Suts = {
  findRepo: FindCourseRepository;
  updateRepo: UpdateCourseRepository;
  sut: UpdateCourseUseCase;
};

const makeSuts = (props: SutsProps): Suts => {
  const findRepo = {
    async find(id: string): Promise<Course | undefined> {
      return props.course;
    },
  };
  const updateRepo = {
    async update(course: Course): Promise<void> {},
  };
  return {
    findRepo,
    updateRepo,
    sut: new UpdateCourseUseCase(findRepo, updateRepo),
  };
};
describe("Update Course Use Case", () => {
  it("Fail updating invalid course", async () => {
    const { sut } = makeSuts({ course: undefined });
    const t = async () => {
      await sut.update({
        id: uuid(),
        name: faker.name.jobArea(),
        active: true,
      });
    };
    await expect(t).rejects.toThrow(EntityNotFoundException);
    await expect(t).rejects.toThrow(Messages.INVALID_COURSE);
  });
  it("updating course changing course name", async () => {
    const course = new Course(uuid(), faker.name.jobArea(), true);
    const { updateRepo, sut } = makeSuts({ course });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const newName = faker.random.word();
    const updatedCourse = await sut.update({
      id: course.id,
      name: newName,
      active: false,
    });

    expect(spyUpdate).toHaveBeenCalledWith(updatedCourse);
    expect(updatedCourse.name).toBe(newName);
  });
  it("updating course changing course status", async () => {
    const course = new Course(uuid(), faker.name.jobArea(), true);
    const { updateRepo, sut } = makeSuts({ course });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const updatedCourse = await sut.update({
      id: course.id,
      name: course.name,
      active: false,
    });

    expect(spyUpdate).toHaveBeenCalledWith(updatedCourse);
    expect(updatedCourse.active).toBe(false);
  });
  it("updating course adding new lessons", async () => {
    const course = new Course(uuid(), faker.name.jobArea(), true);
    const { updateRepo, sut } = makeSuts({ course });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const updatedCourse = await sut.update({
      id: course.id,
      name: course.name,
      active: course.active,
      lessons: [
        {
          name: faker.random.word(),
          number: 1,
          action: UpdateAction.A,
        },
        {
          name: faker.random.word(),
          number: 2,
          action: UpdateAction.A,
        },
      ],
    });
    expect(spyUpdate).toHaveBeenCalledWith(updatedCourse);
    expect(updatedCourse.lessons.length).toBe(2);
  });

  it("updating course removing lessons", async () => {
    const course = new Course(uuid(), faker.name.jobArea(), true);
    course.addLesson(1, faker.random.word());
    course.addLesson(2, faker.random.word());

    const lesson1 = course.lessons[0];

    const { updateRepo, sut } = makeSuts({ course });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const updatedCourse = await sut.update({
      id: course.id,
      name: course.name,
      active: course.active,
      lessons: [
        {
          id: lesson1.id,
          name: lesson1.name,
          number: lesson1.number,
          action: UpdateAction.D,
        },
      ],
    });
    expect(spyUpdate).toHaveBeenCalledWith(updatedCourse);
    expect(updatedCourse.lessons.length).toBe(1);
  });

  it("updating course inactivating a lesson", async () => {
    const course = new Course(uuid(), faker.name.jobArea(), true);
    course.addLesson(1, faker.random.word());
    course.addLesson(2, faker.random.word());

    const lesson1 = course.lessons[0];

    const { updateRepo, sut } = makeSuts({ course });
    const spyUpdate = jest.spyOn(updateRepo, "update");

    const updatedCourse = await sut.update({
      id: course.id,
      name: course.name,
      active: course.active,
      lessons: [
        {
          id: lesson1.id,
          name: lesson1.name,
          number: lesson1.number,
          action: UpdateAction.I,
        },
      ],
    });
    expect(spyUpdate).toHaveBeenCalledWith(updatedCourse);
    expect(updatedCourse.lessons.length).toBe(2);
    const updatedLesson = updatedCourse.lessons.find(
      (l) => l.id === lesson1.id
    );
    expect(updatedLesson).toBeDefined();
    expect(updatedLesson?.active).toBe(false);
  });
});
