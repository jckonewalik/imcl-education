import { Page } from "@/domain/@shared/types/page";
import { Course } from "@/domain/course/entity";
import { FindAllCoursesRepository } from "@/domain/course/repository";
import { Op, WhereOptions } from "sequelize";
import { CourseModel } from "../model";

export class SequelizeFindAllCoursesRepository
  implements FindAllCoursesRepository
{
  async find(
    criteria: object,
    lines: number = 10,
    page: number = 1
  ): Promise<Page<Course>> {
    const name = criteria["name"];
    const active = criteria["active"];

    const where: WhereOptions = {};
    if (name) {
      where["name"] = { [Op.like]: `${name}%` };
    }

    if (active !== undefined) {
      where["active"] = active;
    }

    const result = await CourseModel.findAndCountAll({
      where,
      limit: lines,
      offset: (page - 1) * lines,
    });

    return {
      currentPage: page,
      totalPages: Math.ceil(result.count / lines),
      totalItems: result.count,
      data: result.rows.map((r) => r.toEntity()),
    };
  }
}
