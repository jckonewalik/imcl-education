import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Student } from "@/domain/student/entity";
import { FindStudentRepository } from "@/domain/student/repository";

export class GetStudentUseCase {
  constructor(private readonly findRepo: FindStudentRepository) {}

  async get(id: string): Promise<Student> {
    const student = await this.findRepo.find(id);

    if (!student) {
      throw new EntityNotFoundException(Messages.INVALID_STUDENT);
    }

    return student;
  }
}
