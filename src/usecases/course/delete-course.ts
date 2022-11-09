import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import {
  DeleteCourseRepository,
  FindCourseRepository,
} from "@/domain/course/repository";

export class DeleteCourseUseCase {
  constructor(
    private readonly findRepo: FindCourseRepository,
    private readonly deleteRepo: DeleteCourseRepository
  ) {}

  async delete(id: string): Promise<void> {
    const course = await this.findRepo.find(id);

    if (!course) {
      throw new EntityNotFoundException(Messages.INVALID_COURSE);
    }

    await this.deleteRepo.delete(course.id);
  }
}
