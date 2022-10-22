import { Student } from "@/domain/student/entity/student";
import { NewStudentDto } from "./dto";
import { v4 as uuid } from "uuid";
import { CreateStudentRepository } from "@/domain/student/repository";
import { PhoneNumber } from "@/domain/@shared/value-objects";

export class RegisterStudentUseCase {
  constructor(private readonly createRepo: CreateStudentRepository) {}

  async register(dto: NewStudentDto): Promise<Student> {
    let phone;
    if (dto.phone) {
      phone = new PhoneNumber(dto.phone.number, dto.phone.isWhatsapp);
    }
    const student = new Student(uuid(), dto.name, dto.gender, true, phone);

    await this.createRepo.create(student);

    return student;
  }
}
