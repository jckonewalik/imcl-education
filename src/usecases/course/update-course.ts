import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Course } from "@/domain/course/entity";
import {
  FindCourseRepository,
  UpdateCourseRepository,
} from "@/domain/course/repository/course.repository";
import { UpdateCourseDto } from "./update-course.dto";

export class UpdateCourseUseCase {
  constructor(
    private readonly findRepository: FindCourseRepository,
    private readonly updateRepository: UpdateCourseRepository
  ) {}

  async update(dto: UpdateCourseDto): Promise<Course> {
    const course = await this.findRepository.find(dto.id);

    if (!course) {
      throw new EntityNotFoundException(Messages.INVALID_COURSE);
    }

    if (course.name !== dto.name) {
      course.changeName(dto.name);
    }

    const lessonsToAdd = dto.lessons?.filter((l) => l.action === "A") || [];
    const lessonsToRemove = dto.lessons?.filter((l) => l.action === "D") || [];
    const lessonsToInactivate =
      dto.lessons?.filter((l) => l.action === "I") || [];

    for (const lesson of lessonsToAdd) {
      course.addLesson(lesson.number, lesson.name);
    }

    for (const lesson of lessonsToRemove) {
      const entity = course.lessons.find((l) => l.id === lesson.id);
      if (entity) {
        course.removeLesson(entity);
      }
    }

    for (const lesson of lessonsToInactivate) {
      const entity = course.lessons.find((l) => l.id === lesson.id);
      entity?.inactivate();
    }

    await this.updateRepository.update(course);
    return course;
  }
}
