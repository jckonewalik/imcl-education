import { Gender } from "@/domain/@shared/enums/gender";
import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Email } from "@/domain/@shared/value-objects";
import { Teacher } from "@/domain/teacher/entity";
import {
  CreateTeacherRepository,
  FindTeacherByEmailRepository,
} from "@/domain/teacher/repository";
import { v4 as uuid } from "uuid";

type RegisterProps = {
  name: string;
  gender: Gender;
  email: string;
};

export class RegisterTeacherUseCase {
  constructor(
    private readonly createRepo: CreateTeacherRepository,
    private readonly findRepo: FindTeacherByEmailRepository
  ) {}

  async register(data: RegisterProps): Promise<Teacher> {
    const email = new Email(data.email);

    const exists = await this.findRepo.find(email);
    if (exists) {
      throw new BadRequestException(Messages.TEACHER_EMAIL_ALREADY_IN_USE);
    }
    const teacher = new Teacher(uuid(), data.name, data.gender, email, true);

    await this.createRepo.create(teacher);

    return teacher;
  }
}
