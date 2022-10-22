import {
  BadRequestException,
  EntityNotFoundException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import { Teacher } from "@/domain/teacher/entity";
import {
  FindTeacherByEmailRepository,
  FindTeacherRepository,
  UpdateTeacherRepository,
} from "@/domain/teacher/repository";
import { UpdateTeacherDto } from "./dto";

export class UpdateTeacherUseCase {
  constructor(
    private readonly findRepo: FindTeacherRepository,
    private readonly findByEmalRepo: FindTeacherByEmailRepository,
    private readonly updateRepo: UpdateTeacherRepository
  ) {}
  async update(dto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.findRepo.find(dto.id);
    if (!teacher) {
      throw new EntityNotFoundException(Messages.INVALID_TEACHER);
    }
    if (teacher.name !== dto.name) {
      teacher.changeName(dto.name);
    }
    if (teacher.active !== dto.active) {
      dto.active ? teacher.activate() : teacher.inactivate();
    }
    if (teacher.email.value !== dto.email) {
      const newEmail = new Email(dto.email);
      const exists = await this.findByEmalRepo.find(newEmail);
      if (exists) {
        throw new BadRequestException(Messages.TEACHER_EMAIL_ALREADY_IN_USE);
      }
      teacher.changeEmail(newEmail);
    }

    await this.updateRepo.update(teacher);
    return teacher;
  }
}
