import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { DeleteCourseRepository } from "@/domain/course/repository";
import { CourseModel } from "../model";

export class SequelizeDeleteCourseRepository implements DeleteCourseRepository {
  async delete(id: string): Promise<void> {
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
