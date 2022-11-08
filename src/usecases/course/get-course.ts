import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Course } from "@/domain/course/entity";
import { FindCourseRepository } from "@/domain/course/repository";

export class GetCourseUseCase {
  constructor(private readonly findRepo: FindCourseRepository) {}

  async get(id: string): Promise<Course> {
    const course = await this.findRepo.find(id);

    if (!course) {
      throw new EntityNotFoundException(Messages.INVALID_COURSE);
    }

    return course;
  }
}
