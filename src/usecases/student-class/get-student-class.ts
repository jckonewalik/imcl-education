import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { StudentClass } from "@/domain/student-class/entity";
import { FindStudentClassRepository } from "@/domain/student-class/repository";

export class GetStudentClassUseCase {
  constructor(private readonly findRepo: FindStudentClassRepository) {}

  async get(id: string): Promise<StudentClass> {
    const studentClass = await this.findRepo.find(id);

    if (!studentClass) {
      throw new EntityNotFoundException(Messages.INVALID_STUDENT_CLASS);
    }

    return studentClass;
  }
}
