import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { StudentClass } from "@/domain/student-class/entity";
import { FindInStudentClassesRepository } from "@/domain/student-class/repository";
import { Op } from "sequelize";
import { validate } from "uuid";
import { StudentClassModel } from "../model";
export class SequelizeFindInStudentClassesRepository
  implements FindInStudentClassesRepository
{
  async find(ids: string[]): Promise<StudentClass[]> {
    ids.forEach((id) => {
      if (!validate(id)) {
        throw new BadRequestException(Messages.INVALID_ID);
      }
    });
    const studentClassModels = await StudentClassModel.findAll({
      where: { id: { [Op.in]: ids } },
    });

    return studentClassModels.map((t) => t.toEntity());
  }
}
