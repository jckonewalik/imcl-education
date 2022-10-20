import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { StudentClass } from "@/domain/student-class/entity";
import {
  FindStudentClassRepository,
  UpdateStudentClassRepository,
} from "@/domain/student-class/repository";
import { FindStudentRepository } from "@/domain/student/repository/student.repository";
import { UpdateStudentClassDto } from "./update-student-class.dto";

export class UpdateStudentClassUseCase {
  constructor(
    private readonly findRepo: FindStudentClassRepository,
    private readonly updateRepo: UpdateStudentClassRepository,
    private readonly findStudent: FindStudentRepository
  ) {}

  async update(dto: UpdateStudentClassDto): Promise<StudentClass> {
    const studentClass = await this.findRepo.find(dto.id);

    if (!studentClass) {
      throw new EntityNotFoundException(Messages.INVALID_STUDENT_CLASS);
    }

    if (studentClass.name !== dto.name) {
      studentClass.changeName(dto.name);
    }

    if (studentClass.active !== dto.active) {
      dto.active ? studentClass.activate() : studentClass.inactivate();
    }

    const studentsToEnroll =
      dto.students?.filter((s) => s.action === "A") || [];

    for (const s of studentsToEnroll) {
      const student = await this.findStudent.find(s.studentId);
      studentClass.enrollStudent(student!);
    }

    this.updateRepo.update(studentClass);
    return studentClass;
  }
}
