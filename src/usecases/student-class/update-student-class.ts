import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { StudentClass } from "@/domain/student-class/entity";
import {
  FindStudentClassRepository,
  UpdateStudentClassRepository,
} from "@/domain/student-class/repository";
import { UpdateStudentClassDto } from "./update-student-class.dto";

export class UpdateStudentClassUseCase {
  constructor(
    private readonly findRepo: FindStudentClassRepository,
    private readonly updateRepo: UpdateStudentClassRepository
  ) {}

  async update(dto: UpdateStudentClassDto): Promise<StudentClass> {
    const studentClass = await this.findRepo.find(dto.id);

    if (!studentClass) {
      throw new EntityNotFoundException(Messages.INVALID_STUDENT_CLASS);
    }

    if (studentClass.name !== dto.name) {
      studentClass.changeName(dto.name);
    }

    this.updateRepo.update(studentClass);
    return studentClass;
  }
}
