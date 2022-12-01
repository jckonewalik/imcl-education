import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { ClassRegistry } from "@/domain/class-registry/entity";
import {
  FindClassRegistryRepository,
  UpdateClassRegistryRepository,
} from "@/domain/class-registry/repository";
import { FindCourseRepository } from "@/domain/course/repository";
import { FindStudentClassRepository } from "@/domain/student-class/repository";
import { FindStudentRepository } from "@/domain/student/repository";
import { FindTeacherRepository } from "@/domain/teacher/repository";
import { BadRequestException } from "@nestjs/common";
import { UpdateAction } from "../@shared/enums";

type UpateProps = {
  id: string;
  teacherId: string;
  date: Date;
  students?: {
    studentId: string;
    action: UpdateAction;
  }[];
  lessons?: {
    lessonId: string;
    action: UpdateAction;
  }[];
};

export class UpdateClassRegistryUseCase {
  constructor(
    private readonly findRepo: FindClassRegistryRepository,
    private readonly updateRepo: UpdateClassRegistryRepository,
    private readonly findTeacher: FindTeacherRepository,
    private readonly findStudent: FindStudentRepository,
    private readonly findStudentClass: FindStudentClassRepository,
    private readonly findCourse: FindCourseRepository
  ) {}

  async update(data: UpateProps): Promise<ClassRegistry> {
    const registry = await this.findRepo.find(data.id);

    if (!registry) {
      throw new EntityNotFoundException(Messages.INVALID_CLASS_REGISTRY);
    }

    if (registry.teacherId !== data.teacherId) {
      const teacher = await this.findTeacher.find(data.teacherId);
      if (!teacher) {
        throw new BadRequestException(Messages.INVALID_TEACHER);
      }
      registry.updateTeacher(teacher.id);
    }

    registry.updateDate(data.date);

    await this.updateStudents(registry, data);
    await this.updateLessonss(registry, data);

    registry.validate();

    await this.updateRepo.update(registry);
    return registry;
  }

  private async updateStudents(registry: ClassRegistry, data: UpateProps) {
    const studentsToAdd =
      data.students?.filter((s) => s.action === UpdateAction.A) || [];
    const studentsToRemove =
      data.students?.filter((s) => s.action === UpdateAction.D) || [];

    for (const s of studentsToAdd) {
      const student = await this.findStudent.find(s.studentId);
      if (!student) {
        throw new BadRequestException(Messages.INVALID_STUDENT);
      }
      registry.addStudent(student);
    }

    for (const s of studentsToRemove) {
      const student = await this.findStudent.find(s.studentId);
      if (!student) {
        throw new BadRequestException(Messages.INVALID_STUDENT);
      }
      registry.removeStudent(student);
    }
  }

  private async updateLessonss(registry: ClassRegistry, data: UpateProps) {
    const lessonsToAdd =
      data.lessons?.filter((s) => s.action === UpdateAction.A) || [];
    const lessonsToRemove =
      data.lessons?.filter((s) => s.action === UpdateAction.D) || [];

    if (!lessonsToAdd.length && !lessonsToRemove.length) {
      return;
    }

    const studentClass = await this.findStudentClass.find(
      registry.studentClassId
    );
    if (!studentClass) {
      throw new BadRequestException(Messages.INVALID_STUDENT_CLASS);
    }
    const course = await this.findCourse.find(studentClass?.courseId);
    if (!course) {
      throw new BadRequestException(Messages.INVALID_COURSE);
    }

    for (const l of lessonsToAdd) {
      const lesson = course.lessons.find((lesson) => lesson.id === l.lessonId);
      if (!lesson) {
        throw new BadRequestException(Messages.INVALID_LESSON);
      }
      registry.addLesson(lesson);
    }

    for (const l of lessonsToRemove) {
      const lesson = course.lessons.find((lesson) => lesson.id === l.lessonId);
      if (!lesson) {
        throw new BadRequestException(Messages.INVALID_LESSON);
      }
      registry.removeLesson(lesson);
    }
  }
}
