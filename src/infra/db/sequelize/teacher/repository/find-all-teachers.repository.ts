import { Page } from "@/domain/@shared/types/page";
import { Teacher } from "@/domain/teacher/entity";
import { FindAllTeachersRepository } from "@/domain/teacher/repository";
import { Op, WhereOptions } from "sequelize";
import { TeacherModel } from "../model";

export class SequelizeFindAllTeachersRepository
  implements FindAllTeachersRepository
{
  async find(
    criteria: object,
    lines: number = 10,
    page: number = 1
  ): Promise<Page<Teacher>> {
    const name = criteria["name"];
    const active = criteria["active"];
    const email = criteria["email"];
    const gender = criteria["gender"];

    const where: WhereOptions = {};
    if (name) {
      where["name"] = { [Op.like]: `${name}%` };
    }

    if (active !== undefined) {
      where["active"] = active;
    }

    if (email) {
      where["email"] = { [Op.eq]: email };
    }

    if (gender) {
      where["gender"] = gender;
    }

    const result = await TeacherModel.findAndCountAll({
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