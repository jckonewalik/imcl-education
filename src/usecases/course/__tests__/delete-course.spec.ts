import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Course } from "@/domain/course/entity";
import { DeleteCourseRepository } from "@/domain/course/repository";
import faker from "faker";
import { v4 as uuid } from "uuid";
import { DeleteCourseUseCase } from "../delete-course";

type SutsProps = {
  courses?: Map<string, Course>;
};

type Suts = {
  deleteRepo: DeleteCourseRepository;
  sut: DeleteCourseUseCase;
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
  const findRepo = {
    find: async (id: string) => {
      return courses?.get(id);
    },
  };
  const deleteRepo = {
    delete: async (id: string) => {},
  };
  const sut = new DeleteCourseUseCase(findRepo, deleteRepo);
  return { deleteRepo, sut };
};

describe("Delete Course Use Case", () => {
  it("Delete a course by ID", async () => {
    const { course1, coursesMap } = makeCourses();
    const { deleteRepo, sut } = makeSuts({ courses: coursesMap });

    const spyDelete = jest.spyOn(deleteRepo, "delete");
    await sut.delete(course1.id);

    expect(spyDelete).toHaveBeenCalledWith(course1.id);
  });

  it("Fail deleting a invalid course", async () => {
    const { sut } = makeSuts({});

    const t = async () => {
      await sut.delete(uuid());
    };

    await expect(t).rejects.toThrow(EntityNotFoundException);
    await expect(t).rejects.toThrow(Messages.INVALID_COURSE);
  });
});
