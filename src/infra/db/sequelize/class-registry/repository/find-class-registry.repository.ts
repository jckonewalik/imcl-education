import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { ClassRegistry } from "@/domain/class-registry/entity";
import { FindClassRegistryRepository } from "@/domain/class-registry/repository";
import { validate } from "uuid";
import { ClassRegistryModel } from "../model";
export class SequelizeFindClassRegistryRepository
  implements FindClassRegistryRepository
{
  async find(id: string): Promise<ClassRegistry | undefined> {
    if (!validate(id)) {
      throw new BadRequestException(Messages.INVALID_ID);
    }
    const registry = await ClassRegistryModel.findOne({
      where: { id },
      include: ["lessons", "students"],
    });

    if (!registry) {
      return undefined;
    }

    return registry.toEntity();
  }
}
