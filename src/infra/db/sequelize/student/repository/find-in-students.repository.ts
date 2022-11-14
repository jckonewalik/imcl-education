import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { Student } from "@/domain/student/entity";
import { FindInStudentsRepository } from "@/domain/student/repository";
import { Op } from "sequelize";
import { validate } from "uuid";
import { StudentModel } from "../model";
export class SequelizeFindInStudentsRepository
  implements FindInStudentsRepository
{
  async find(ids: string[]): Promise<Student[]> {
    ids.forEach((id) => {
      if (!validate(id)) {
        throw new BadRequestException(Messages.INVALID_ID);
      }
    });
    const studentModels = await StudentModel.findAll({
      where: { id: { [Op.in]: ids } },
    });

    return studentModels.map((t) => t.toEntity());
  }
}
