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
import { FindStudentRepository } from "@/domain/student/repository/student.repository";
import { FindTeacherRepository } from "@/domain/teacher/repository/teacher.repository";
import { UpdateAction } from "../@shared/enums";
import { UpdateStudentClassDto } from "./dto";

export class UpdateStudentClassUseCase {
  constructor(
    private readonly findRepo: FindStudentClassRepository,
    private readonly updateRepo: UpdateStudentClassRepository,
    private readonly findStudent: FindStudentRepository,
    private readonly findTeacher: FindTeacherRepository
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
    await this.updateTeachers(studentClass, dto);

    this.updateRepo.update(studentClass);
    return studentClass;
  }

  private async updateEnrollments(
    studentClass: StudentClass,
    dto: UpdateStudentClassDto
  ) {
    const studentsToEnroll =
      dto.students?.filter((s) => s.action === UpdateAction.A) || [];
    const studentsToUnenroll =
      dto.students?.filter((s) => s.action === UpdateAction.D) || [];

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

  private async updateTeachers(
    studentClass: StudentClass,
    dto: UpdateStudentClassDto
  ) {
    const teachersToAdd =
      dto.teachers?.filter((s) => s.action === UpdateAction.A) || [];
    const teachersToRemove =
      dto.teachers?.filter((s) => s.action === UpdateAction.D) || [];

    for (const t of teachersToAdd) {
      const teacher = await this.findTeacher.find(t.teacherId);
      if (!teacher) {
        throw new BadRequestException(Messages.INVALID_TEACHER);
      }
      studentClass.addTeacher(teacher);
    }

    for (const t of teachersToRemove) {
      const teacher = await this.findTeacher.find(t.teacherId);
      if (!teacher) {
        throw new BadRequestException(Messages.INVALID_TEACHER);
      }
      studentClass.removeTeacher(teacher);
    }
  }
}
