import { Course } from "@/domain/course/entity";
import { CreateCourseRepository } from "@/domain/course/repository";
import { CourseModel } from "../model/course.model";

export class SequelizeCreateCourseRepository implements CreateCourseRepository {
  async create(entity: Course): Promise<void> {
    await CourseModel.create(
      {
        id: entity.id,
        name: entity.name,
        active: entity.active,
        lessons: entity.lessons.map((l) => ({
          id: l.id,
          courseId: l.courseId,
          number: l.number,
          name: l.name,
          active: l.active,
        })),
      },
      { include: "lessons" }
    );
  }
}
