import { Course } from "@/domain/course/entity";
import { FindCourseRepository } from "@/domain/course/repository";
import { CourseModel } from "../model";

export class SequelizeFindCourseRepository implements FindCourseRepository {
  async find(id: string): Promise<Course | undefined> {
    const courseModel = await CourseModel.findOne({
      where: { id },
      include: "lessons",
    });

    if (!courseModel) {
      return undefined;
    }

    return courseModel.toEntity();
  }
}
