import { Course } from "@/domain/course/entity";
import CreateCourseUseCase from "../create-course";
import faker from "faker";
import { CreateCourseRepository } from "@/domain/course/repository/course.repository";

type Suts = {
  createRepository: CreateCourseRepository;
};

const getSuts = (): Suts => {
  const repository = {
    create: async (course: Course) => {},
  };
  return { createRepository: repository };
};

describe("Create Course Use Case", () => {
  it("Create a new Course", async () => {
    const { createRepository } = getSuts();
    const spyCreate = jest.spyOn(createRepository, "create");

    const useCase = new CreateCourseUseCase(createRepository);

    const dto = { name: faker.name.jobArea() };
    const result = await useCase.create(dto);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(dto.name);
    expect(result.active).toBe(true);
    expect(spyCreate).toHaveBeenCalledWith(result);
  });
});
