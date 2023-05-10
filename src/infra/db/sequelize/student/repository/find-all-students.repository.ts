import { Page } from "@/domain/@shared/types/page";
import { Student } from "@/domain/student/entity";
import { FindAllStudentsRepository } from "@/domain/student/repository";
import { Op, Order, WhereOptions } from "sequelize";
import { StudentModel } from "../model";

export class SequelizeFindAllStudentsRepository
  implements FindAllStudentsRepository
{
  async find(
    criteria: object,
    sortBy: string = "name",
    sortOrder: "ASC" | "DESC" = "ASC",
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

    const order: Order = [];
    if (Object.keys(StudentModel.getAttributes()).includes(sortBy)) {
      order.push([sortBy, sortOrder]);
      order.push(["id", "ASC"]);
    }

    const result = await StudentModel.findAndCountAll({
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
