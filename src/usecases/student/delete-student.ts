import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import {
  DeleteStudentRepository,
  FindStudentRepository,
} from "@/domain/student/repository";

export class DeleteStudentUseCase {
  constructor(
    private readonly findRepo: FindStudentRepository,
    private readonly deleteRepo: DeleteStudentRepository
  ) {}

  async delete(id: string): Promise<void> {
    const student = await this.findRepo.find(id);

    if (!student) {
      throw new EntityNotFoundException(Messages.INVALID_STUDENT);
    }

    await this.deleteRepo.delete(student.id);
  }
}
