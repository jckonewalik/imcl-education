import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import {
  DeleteTeacherRepository,
  FindTeacherRepository,
} from "@/domain/teacher/repository";

export class DeleteTeacherUseCase {
  constructor(
    private readonly findRepo: FindTeacherRepository,
    private readonly deleteRepo: DeleteTeacherRepository
  ) {}

  async delete(id: string): Promise<void> {
    const teacher = await this.findRepo.find(id);

    if (!teacher) {
      throw new EntityNotFoundException(Messages.INVALID_TEACHER);
    }

    await this.deleteRepo.delete(teacher.id);
  }
}
