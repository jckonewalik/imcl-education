import { Course } from "@/domain/course/entity";
import { CreateCourseRepository } from "@/domain/course/repository/course.repository";
import { CreateCourseDto } from "./dto";
import { v4 as uuid } from "uuid";

export default class CreateCourseUseCase {
  constructor(private readonly repository: CreateCourseRepository) {}

  async create(dto: CreateCourseDto): Promise<Course> {
    const course = new Course(uuid(), dto.name, true);

    await this.repository.create(course);
    return course;
  }
}
