import { Teacher } from "@/domain/teacher/entity";
import {
  CreateTeacherRepository,
  FindTeacherByEmailRepository,
} from "@/domain/teacher/repository/teacher.repository";
import { CreateTeacherDto } from "./create-teacher.dto";
import { v4 as uuid } from "uuid";
import { Email } from "@/domain/@shared/value-objects";
import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
export class CreateTeacherUseCase {
  constructor(
    private readonly createRepo: CreateTeacherRepository,
    private readonly findRepo: FindTeacherByEmailRepository
  ) {}

  async create(dto: CreateTeacherDto): Promise<Teacher> {
    const email = new Email(dto.email);

    const exists = await this.findRepo.find(email);
    if (exists) {
      throw new BadRequestException(Messages.TEACHER_EMAIL_ALREADY_IN_USE);
    }
    const teacher = new Teacher(uuid(), dto.name, dto.gender, email, true);

    await this.createRepo.create(teacher);

    return teacher;
  }
}
