import { ClassRegistry } from "@/domain/class-registry/entity";
import { FindClassRegitryByDateRepository } from "@/domain/class-registry/repository";
import { ClassRegistryModel } from "../model";

export class SequelizeFindClassRegitryByDateRepository
  implements FindClassRegitryByDateRepository
{
  async find(
    studentClassId: string,
    date: Date
  ): Promise<ClassRegistry | undefined> {
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
