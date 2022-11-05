import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Teacher } from "@/domain/teacher/entity";
import { FindTeacherRepository } from "@/domain/teacher/repository";

export class GetTeacherUseCase {
  constructor(private readonly findRepo: FindTeacherRepository) {}

  async get(id: string): Promise<Teacher> {
    const teacher = await this.findRepo.find(id);

    if (!teacher) {
      throw new EntityNotFoundException(Messages.INVALID_TEACHER);
    }

    return teacher;
  }
}
