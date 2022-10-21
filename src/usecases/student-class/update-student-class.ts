import {
  BadRequestException,
  EntityNotFoundException,
} from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { StudentClass } from "@/domain/student-class/entity";
import {
  FindStudentClassRepository,
  UpdateStudentClassRepository,
} from "@/domain/student-class/repository";
import { Student } from "@/domain/student/entity/student";
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

    await this.updateEnrollments(studentClass, dto);

    this.updateRepo.update(studentClass);
    return studentClass;
  }

  private async updateEnrollments(
    studentClass: StudentClass,
    dto: UpdateStudentClassDto
  ) {
    const studentsToEnroll =
      dto.students?.filter((s) => s.action === "A") || [];
    const studentsToUnenroll =
      dto.students?.filter((s) => s.action === "D") || [];

    for (const s of studentsToEnroll) {
      const student = await this.findStudent.find(s.studentId);
      if (!student) {
        throw new BadRequestException(Messages.INVALID_STUDENT);
      }
      studentClass.enrollStudent(student);
    }

    for (const s of studentsToUnenroll) {
      const student = await this.findStudent.find(s.studentId);
      if (!student) {
        throw new BadRequestException(Messages.INVALID_STUDENT);
      }
      studentClass.unenrollStudent(student);
    }
  }
}
