import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { ClassRegistry } from "@/domain/class-registry/entity";
import {
  CreateClassRegistryRepository,
  FindClassRegitryByDateRepository,
} from "@/domain/class-registry/repository";
import { FindCourseRepository } from "@/domain/course/repository";
import { FindStudentClassRepository } from "@/domain/student-class/repository";
import { FindTeacherRepository } from "@/domain/teacher/repository";
import { v4 as uuid } from "uuid";
type Props = {
  studentClassId: string;
  date: Date;
  teacherId: string;
  studentIds: string[];
  lessonIds: string[];
};
export class CreateClassRegistryUseCase {
  constructor(
    private readonly findRepo: FindClassRegitryByDateRepository,
    private readonly findStudentClassRepo: FindStudentClassRepository,
    private readonly findTeacherRepo: FindTeacherRepository,
    private readonly findCourseRepo: FindCourseRepository,
    private readonly createRepo: CreateClassRegistryRepository
  ) {}

  async create({
    studentClassId,
    date,
    teacherId,
    studentIds = [],
    lessonIds = [],
  }: Props): Promise<ClassRegistry> {
    const studentClass = await this.findStudentClassRepo.find(studentClassId);
    if (!studentClass) {
      throw new BadRequestException(Messages.INVALID_STUDENT_CLASS);
    }
    if (!studentClass.active) {
      throw new BadRequestException(Messages.STUDENT_CLASS_INACTIVE);
    }

    const exists = await this.findRepo.find(studentClassId, date);
    if (exists) {
      throw new BadRequestException(Messages.DUPLICATED_CLASS_REGISTRY);
    }

    const teacher = await this.findTeacherRepo.find(teacherId);
    if (!teacher) {
      throw new BadRequestException(Messages.INVALID_TEACHER);
    }
    if (!teacher.active) {
      throw new BadRequestException(Messages.TEACHER_INACTIVE);
    }

    if (!studentClass.teacherIds.includes(teacher.id)) {
      throw new BadRequestException(Messages.TEACHER_NOT_PRESENT);
    }

    const students = studentClass.enrollments.map((e) => e.studentId);
    for (const id of studentIds) {
      if (!students.includes(id)) {
        throw new BadRequestException(Messages.STUDENT_NOT_ASSOCIATED);
      }
    }

    if (lessonIds.length) {
      const course = await this.findCourseRepo.find(studentClass.courseId);
      const ids = course?.lessons.map((l) => l.id);
      for (const id of lessonIds) {
        if (!ids?.includes(id)) {
          throw new BadRequestException(Messages.INVALID_LESSON);
        }
      }
    }

    const registry = new ClassRegistry(
      uuid(),
      studentClassId,
      date,
      teacherId,
      studentIds,
      lessonIds
    );

    await this.createRepo.create(registry);

    return registry;
  }
}
