import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { ClassRegistry } from "@/domain/class-registry/entity";
import { FindClassRegitryByStudentClassRepository } from "@/domain/class-registry/repository";
import { validate } from "uuid";
import { ClassRegistryModel } from "../model";

export class SequelizeFindClassRegitryByStudentClassRepository
  implements FindClassRegitryByStudentClassRepository
{
  async find(studentClassId: string): Promise<ClassRegistry[]> {
    if (!validate(studentClassId)) {
      throw new BadRequestException(Messages.INVALID_ID);
    }
    const rows = await ClassRegistryModel.findAll({
      where: {
        studentClassId: studentClassId,
      },
      include: ["students", "lessons"],
    });

    return rows.map((model) => model.toEntity());
  }
}
