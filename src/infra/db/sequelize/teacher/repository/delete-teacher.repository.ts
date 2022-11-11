import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { DeleteTeacherRepository } from "@/domain/teacher/repository";
import { validate } from "uuid";
import { TeacherModel } from "../model";
export class SequelizeDeleteTeacherRepository
  implements DeleteTeacherRepository
{
  async delete(id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException(Messages.INVALID_ID);
    }
    await TeacherModel.destroy({
      where: { id },
    });
  }
}
