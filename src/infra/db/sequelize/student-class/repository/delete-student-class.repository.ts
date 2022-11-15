import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { DeleteStudentClassRepository } from "@/domain/student-class/repository";
import { validate } from "uuid";
import { StudentClassModel } from "../model";
export class SequelizeDeleteStudentClassRepository
  implements DeleteStudentClassRepository
{
  async delete(id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException(Messages.INVALID_ID);
    }
    await StudentClassModel.destroy({
      where: { id },
    });
  }
}
