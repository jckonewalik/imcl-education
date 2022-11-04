import { Course } from "@/domain/course/entity";
import { CreateCourseRepository } from "@/domain/course/repository";

import { v4 as uuid } from "uuid";

export default class CreateCourseUseCase {
  constructor(private readonly repository: CreateCourseRepository) {}

  async create({ name }): Promise<Course> {
    const course = new Course(uuid(), name, true);

    await this.repository.create(course);
    return course;
  }
}
