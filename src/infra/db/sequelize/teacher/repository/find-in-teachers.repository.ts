import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Teacher } from "@/domain/teacher/entity";
import { FindInTeachersRepository } from "@/domain/teacher/repository";
import { Op } from "sequelize";
import { validate } from "uuid";
import { TeacherModel } from "../model";
export class SequelizeFindInTeachersRepository
  implements FindInTeachersRepository
{
  async find(ids: string[]): Promise<Teacher[]> {
    ids.forEach((id) => {
      if (!validate(id)) {
        throw new BadRequestException(Messages.INVALID_ID);
      }
    });
    const teacherModels = await TeacherModel.findAll({
      where: { id: { [Op.in]: ids } },
    });

    return teacherModels.map((t) => t.toEntity());
  }
}
