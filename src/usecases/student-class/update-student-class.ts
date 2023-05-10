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
import { FindStudentRepository } from "@/domain/student/repository";
import { FindTeacherRepository } from "@/domain/teacher/repository";
import { UpdateAction } from "../@shared/enums";

type UpateProps = {
  id: string;
  name: string;
  active: boolean;
  year?: number;
  students?: {
    studentId: string;
    action: UpdateAction;
  }[];
  teachers?: {
    teacherId: string;
    action: UpdateAction;
  }[];
};

export class UpdateStudentClassUseCase {
  constructor(
    private readonly findRepo: FindStudentClassRepository,
    private readonly updateRepo: UpdateStudentClassRepository,
    private readonly findStudent: FindStudentRepository,
    private readonly findTeacher: FindTeacherRepository
  ) {}

  async update(data: UpateProps): Promise<StudentClass> {
    const studentClass = await this.findRepo.find(data.id);

    if (!studentClass) {
      throw new EntityNotFoundException(Messages.INVALID_STUDENT_CLASS);
    }

    if (studentClass.name !== data.name) {
      studentClass.changeName(data.name);
    }

    if (studentClass.year !== data.year) {
      studentClass.changeYear(data.year);
    }

    if (studentClass.active !== data.active) {
      data.active ? studentClass.activate() : studentClass.inactivate();
    }

    await this.updateEnrollments(studentClass, data);
    await this.updateTeachers(studentClass, data);

    await this.updateRepo.update(studentClass);
    return studentClass;
  }

  private async updateEnrollments(
    studentClass: StudentClass,
    data: UpateProps
  ) {
    const studentsToEnroll =
      data.students?.filter((s) => s.action === UpdateAction.A) || [];
    const studentsToUnenroll =
      data.students?.filter((s) => s.action === UpdateAction.D) || [];

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

  private async updateTeachers(studentClass: StudentClass, data: UpateProps) {
    const teachersToAdd =
      data.teachers?.filter((s) => s.action === UpdateAction.A) || [];
    const teachersToRemove =
      data.teachers?.filter((s) => s.action === UpdateAction.D) || [];

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
