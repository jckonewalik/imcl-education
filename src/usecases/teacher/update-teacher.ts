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

type UpdateProps = {
  id: string;
  name: string;
  email: string;
  active: boolean;
};

export class UpdateTeacherUseCase {
  constructor(
    private readonly findRepo: FindTeacherRepository,
    private readonly findByEmalRepo: FindTeacherByEmailRepository,
    private readonly updateRepo: UpdateTeacherRepository
  ) {}
  async update(data: UpdateProps): Promise<Teacher> {
    const teacher = await this.findRepo.find(data.id);
    if (!teacher) {
      throw new EntityNotFoundException(Messages.INVALID_TEACHER);
    }
    if (teacher.name !== data.name) {
      teacher.changeName(data.name);
    }
    if (teacher.active !== data.active) {
      data.active ? teacher.activate() : teacher.inactivate();
    }
    if (teacher.email.value !== data.email) {
      const newEmail = new Email(data.email);
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
