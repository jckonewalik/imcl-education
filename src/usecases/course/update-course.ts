import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Course } from "@/domain/course/entity";
import {
  FindCourseRepository,
  UpdateCourseRepository,
} from "@/domain/course/repository";
import { UpdateAction } from "../@shared/enums";

type UpdateProps = {
  id: string;
  name: string;
  active: boolean;
  lessons?: {
    id?: string;
    name: string;
    number: number;
    action: UpdateAction;
  }[];
};

export class UpdateCourseUseCase {
  constructor(
    private readonly findRepository: FindCourseRepository,
    private readonly updateRepository: UpdateCourseRepository
  ) {}

  async update(data: UpdateProps): Promise<Course> {
    const course = await this.findRepository.find(data.id);

    if (!course) {
      throw new EntityNotFoundException(Messages.INVALID_COURSE);
    }

    if (course.name !== data.name) {
      course.changeName(data.name);
    }

    if (course.active !== data.active) {
      data.active ? course.activate() : course.inactivate();
    }

    this.updateLessons(course, data);

    await this.updateRepository.update(course);
    return course;
  }

  private updateLessons(course: Course, data: UpdateProps) {
    const lessonsToAdd =
      data.lessons?.filter((l) => l.action === UpdateAction.A) || [];
    const lessonsToRemove =
      data.lessons?.filter((l) => l.action === UpdateAction.D) || [];
    const lessonsToInactivate =
      data.lessons?.filter((l) => l.action === UpdateAction.I) || [];

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
  }
}
