import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Course } from "@/domain/course/entity";
import { FindCourseRepository } from "@/domain/course/repository";
import { validate } from "uuid";
import { CourseModel } from "../model";

export class SequelizeFindCourseRepository implements FindCourseRepository {
  async find(id: string): Promise<Course | undefined> {
    if (!validate(id)) {
      throw new BadRequestException(Messages.INVALID_ID);
    }
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
