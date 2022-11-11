import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { DeleteCourseRepository } from "@/domain/course/repository";
import { validate } from "uuid";
import { CourseModel } from "../model";
export class SequelizeDeleteCourseRepository implements DeleteCourseRepository {
  async delete(id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException(Messages.INVALID_ID);
    }
    try {
      await CourseModel.destroy({
        where: { id },
      });
    } catch (error: any) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        throw new BadRequestException(Messages.COURSE_IN_USE);
      }
      throw error;
    }
  }
}
