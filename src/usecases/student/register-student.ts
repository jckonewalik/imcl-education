import { Gender } from "@/domain/@shared/enums/gender";
import { PhoneNumber } from "@/domain/@shared/value-objects";
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
};

export class RegisterStudentUseCase {
  constructor(private readonly createRepo: CreateStudentRepository) {}

  async register(data: RegisterProps): Promise<Student> {
    let phone;
    if (data.phone) {
      phone = new PhoneNumber(data.phone.number, data.phone.isWhatsapp);
    }
    const student = new Student({
      id: uuid(),
      name: data.name,
      gender: data.gender,
      active: true,
      phone,
    });

    await this.createRepo.create(student);

    return student;
  }
}
