import { StudentClass } from "@/domain/student-class/entity";

import { CreateStudentClassRepository } from "@/domain/student-class/repository";
import { CreateStudentClassUseCase } from "../create-student-class";
import faker from "faker";
import { Course } from "@/domain/course/entity";
import { v4 as uuid } from "uuid";
import Messages from "@/domain/@shared/util/messages";
import { EntityNotFoundException } from "@/domain/@shared/exceptions";
type SutsProps = {
  course?: Course;
};
type Suts = {
  createRepository: CreateStudentClassRepository;
  sut: CreateStudentClassUseCase;
};

const makeSuts = (props: SutsProps): Suts => {
  const findCourseRepo = {
    find: async (id: string): Promise<Course | undefined> => {
      return props.course;
    },
  };
  const createRepo = {
    create: async (studentClass: StudentClass) => {},
  };

  return {
    createRepository: createRepo,
    sut: new CreateStudentClassUseCase(createRepo, findCourseRepo),
  };
};

describe("Create Student Class Use Case", () => {
  it("Create a new Student class", async () => {
    const course = new Course(uuid(), faker.name.jobArea(), true);
    const { createRepository, sut } = makeSuts({ course });
    const spyCreate = jest.spyOn(createRepository, "create");

    const dto = { courseId: course.id, name: faker.name.jobArea() };
    const result = await sut.create(dto);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(dto.name);
    expect(result.courseId).toBe(dto.courseId);
    expect(result.active).toBe(true);
    expect(spyCreate).toHaveBeenCalledWith(result);
  });

  it("Fail creating a new Student class with invalid course", async () => {
    const { createRepository, sut } = makeSuts({});

    const dto = { courseId: uuid(), name: faker.name.jobArea() };
    const t = async () => {
      await sut.create(dto);
    };

    await expect(t).rejects.toThrow(EntityNotFoundException);
    // expect(t).toThrow(Messages.INVALID_COURSE);
  });
});
