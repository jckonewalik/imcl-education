import { BadRequestException } from "@/domain/@shared/exceptions";
import { Page } from "@/domain/@shared/types/page";
import Messages from "@/domain/@shared/util/messages";
import { StudentClass } from "@/domain/student-class/entity";
import { FindAllStudentClassesRepository } from "@/domain/student-class/repository";
import { Op, Order, WhereOptions } from "sequelize";
import { validate } from "uuid";
import { StudentClassModel } from "../model";
export class SequelizeFindAllStudentClassesRepository
  implements FindAllStudentClassesRepository
{
  async find(
    criteria: object,
    sortBy: string = "name",
    sortOrder: "ASC" | "DESC" = "ASC",
    lines: number = 10,
    page: number = 1
  ): Promise<Page<StudentClass>> {
    const name = criteria["name"];
    const active = criteria["active"];
    const courseId = criteria["courseId"];
    const year = criteria["year"];

    const where: WhereOptions = {};
    if (name) {
      where["name"] = { [Op.like]: `${name}%` };
    }

    if (active !== undefined) {
      where["active"] = active;
    }

    if (courseId) {
      if (!validate(courseId)) {
        throw new BadRequestException(Messages.INVALID_ID);
      }
      where["courseId"] = courseId;
    }

    if (year) {
      where["year"] = year;
    }

    const order: Order = [];
    if (Object.keys(StudentClassModel.getAttributes()).includes(sortBy)) {
      order.push([sortBy, sortOrder]);
    }

    const result = await StudentClassModel.findAndCountAll({
      where,
      order,
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
