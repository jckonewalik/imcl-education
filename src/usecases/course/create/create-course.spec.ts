import { Course } from "@/domain/course/entity";
import CourseRepository from "@/domain/course/repository/course.repository";
import CreateCourseUseCase from "./create-course";
import faker from "faker";

class MockCourseRepository implements CourseRepository {
  async create(entity: Course): Promise<void> {
    console.log("creating course ...");
  }
  async update(entity: Course): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async find(id: string): Promise<Course> {
    throw new Error("Method not implemented.");
  }
}

describe("Create Course Use Case", () => {
  it("Create a new Course", async () => {
    const repository = new MockCourseRepository();
    const spyCreate = jest.spyOn(repository, "create");

    const useCase = new CreateCourseUseCase(repository);

    const dto = { name: faker.name.jobArea() };
    const result = await useCase.create(dto);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(dto.name);
    expect(result.active).toBe(true);
    expect(spyCreate).toHaveBeenCalledWith(result);
  });
});
