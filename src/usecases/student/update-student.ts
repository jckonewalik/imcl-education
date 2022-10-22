import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { PhoneNumber } from "@/domain/@shared/value-objects";
import { Student } from "@/domain/student/entity/student";
import {
  FindStudentRepository,
  UpdateStudentRepository,
} from "@/domain/student/repository";
import { UpdateStudentDto } from "./dto/update-student.dto";

export class UpdateStudentUseCase {
  constructor(
    private readonly findRepo: FindStudentRepository,
    private readonly updateRepo: UpdateStudentRepository
  ) {}
  async update(dto: UpdateStudentDto): Promise<Student> {
    const student = await this.findRepo.find(dto.id);
    if (!student) {
      throw new EntityNotFoundException(Messages.INVALID_STUDENT);
    }
    if (student.name !== dto.name) {
      student.changeName(dto.name);
    }
    if (student.active !== dto.active) {
      dto.active ? student.activate() : student.inactivate();
    }
    const newPhone = dto.phone
      ? new PhoneNumber(dto.phone.number, dto.phone.isWhatsapp)
      : undefined;
    if (!student.phone?.equals(newPhone)) {
      student.changePhone(newPhone);
    }

    await this.updateRepo.update(student);
    return student;
  }
}
