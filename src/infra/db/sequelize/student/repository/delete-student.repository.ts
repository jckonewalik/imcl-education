import { BadRequestException } from "@/domain/@shared/exceptions";
import { DeleteRepository } from "@/domain/@shared/repository/repository";
import Messages from "@/domain/@shared/util/messages";
import { validate } from "uuid";
import { StudentModel } from "../model";
export class SequelizeDeleteStudentRepository implements DeleteRepository {
  async delete(id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException(Messages.INVALID_ID);
    }
    try {
      await StudentModel.destroy({
        where: { id },
      });
    } catch (error: any) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        throw new BadRequestException(Messages.STUDENT_ENROLLED);
      }
      throw error;
    }
  }
}
