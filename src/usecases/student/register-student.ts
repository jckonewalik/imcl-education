import { Gender } from "@/domain/@shared/enums/gender";
import { EntityNotFoundException, InvalidValueException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { PhoneNumber } from "@/domain/@shared/value-objects";
import { FindStudentClassRepository } from "@/domain/student-class/repository";
import { Student } from "@/domain/student/entity/student";
import { CreateStudentRepository } from "@/domain/student/repository";
import { v4 as uuid } from "uuid";

type RegisterProps = {
  name: string;
  gender: Gender;
  phone?: {
    number: string;
    isWhatsapp: boolean;
  };
  studentClassId: string;
};

export class RegisterStudentUseCase {
  constructor(private readonly createRepo: CreateStudentRepository,
    private readonly findStudentClassRepo: FindStudentClassRepository) { }

  async register(data: RegisterProps): Promise<Student> {

    const studentClass = await this.findStudentClassRepo.find(data.studentClassId);
    if (!studentClass) {
      throw new EntityNotFoundException(Messages.INVALID_STUDENT_CLASS);
    }

    if (!studentClass.active) {
      throw new InvalidValueException(Messages.REQUIRES_ACTIVE_STUDENT_CLASS);
    }

    let phone;
    if (data.phone) {
      phone = new PhoneNumber(data.phone.number, data.phone.isWhatsapp);
    }
    const student = new Student({
      id: uuid(),
      studentClassId: studentClass.id,
      name: data.name,
      gender: data.gender,
      active: true,
      phone,
    });

    await this.createRepo.create(student);

    return student;
  }
}
