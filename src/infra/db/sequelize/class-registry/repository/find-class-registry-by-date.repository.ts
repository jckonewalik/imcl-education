import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { ClassRegistry } from "@/domain/class-registry/entity";
import { FindClassRegitryByDateRepository } from "@/domain/class-registry/repository";
import { validate } from "uuid";
import { ClassRegistryModel } from "../model";

export class SequelizeFindClassRegitryByDateRepository
  implements FindClassRegitryByDateRepository
{
  async find(
    studentClassId: string,
    date: Date
  ): Promise<ClassRegistry | undefined> {
    if (!validate(studentClassId)) {
      throw new BadRequestException(Messages.INVALID_ID);
    }
    const model = await ClassRegistryModel.findOne({
      where: {
        studentClassId: studentClassId,
        date: date,
      },
      include: ["students", "lessons"],
    });

    return model?.toEntity();
  }
}
