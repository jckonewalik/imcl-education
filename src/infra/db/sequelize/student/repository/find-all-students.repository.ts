import { Page } from "@/domain/@shared/types/page";
import { Student } from "@/domain/student/entity";
import { FindAllStudentsRepository } from "@/domain/student/repository";
import { Op, WhereOptions } from "sequelize";
import { StudentModel } from "../model";

export class SequelizeFindAllStudentsRepository
  implements FindAllStudentsRepository
{
  async find(
    criteria: object,
    lines: number = 10,
    page: number = 1
  ): Promise<Page<Student>> {
    const name = criteria["name"];
    const active = criteria["active"];
    const gender = criteria["gender"];

    const where: WhereOptions = {};
    if (name) {
      where["name"] = { [Op.like]: `${name}%` };
    }

    if (active !== undefined) {
      where["active"] = active;
    }

    if (gender) {
      where["gender"] = gender;
    }

    const result = await StudentModel.findAndCountAll({
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
