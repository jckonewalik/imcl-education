import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Course } from "@/domain/course/entity";
import { FindInCoursesRepository } from "@/domain/course/repository";
import { Op } from "sequelize";
import { validate } from "uuid";
import { CourseModel } from "../model";
export class SequelizeFindInCoursesRepository
  implements FindInCoursesRepository
{
  async find(ids: string[]): Promise<Course[]> {
    ids.forEach((id) => {
      if (!validate(id)) {
        throw new BadRequestException(Messages.INVALID_ID);
      }
    });
    const courseModels = await CourseModel.findAll({
      where: { id: { [Op.in]: ids } },
    });

    return courseModels.map((t) => t.toEntity());
  }
}
