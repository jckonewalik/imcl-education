import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { PhoneNumber } from "@/domain/@shared/value-objects";
import { Student } from "@/domain/student/entity/student";
import {
  FindStudentRepository,
  UpdateStudentRepository,
} from "@/domain/student/repository";

type UpdateProps = {
  id: string;
  name: string;
  phone?: {
    number: string;
    isWhatsapp: boolean;
  };
  active: boolean;
};

export class UpdateStudentUseCase {
  constructor(
    private readonly findRepo: FindStudentRepository,
    private readonly updateRepo: UpdateStudentRepository
  ) {}
  async update(data: UpdateProps): Promise<Student> {
    const student = await this.findRepo.find(data.id);
    if (!student) {
      throw new EntityNotFoundException(Messages.INVALID_STUDENT);
    }
    if (student.name !== data.name) {
      student.changeName(data.name);
    }
    if (student.active !== data.active) {
      data.active ? student.activate() : student.inactivate();
    }
    const newPhone = data.phone
      ? new PhoneNumber(data.phone.number, data.phone.isWhatsapp)
      : undefined;
    if (!student.phone?.equals(newPhone)) {
      student.changePhone(newPhone);
    }

    await this.updateRepo.update(student);
    return student;
  }
}
