import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import {
  DeleteStudentClassRepository,
  FindStudentClassRepository,
} from "@/domain/student-class/repository";

export class DeleteStudentClassUseCase {
  constructor(
    private readonly findRepo: FindStudentClassRepository,
    private readonly deleteRepo: DeleteStudentClassRepository
  ) {}

  async delete(id: string): Promise<void> {
    const studentClass = await this.findRepo.find(id);

    if (!studentClass) {
      throw new EntityNotFoundException(Messages.INVALID_STUDENT_CLASS);
    }

    await this.deleteRepo.delete(studentClass.id);
  }
}
