import { DeleteTeacherRepository } from "@/domain/teacher/repository";
import { TeacherModel } from "../model";

export class SequelizeDeleteTeacherRepository
  implements DeleteTeacherRepository
{
  async delete(id: string): Promise<void> {
    await TeacherModel.destroy({
      where: { id },
    });
  }
}
