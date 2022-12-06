import { BadRequestException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { DeleteClassRegistryRepository } from "@/domain/class-registry/repository";
import { validate } from "uuid";
import { ClassRegistryModel } from "../model";
export class SequelizeDeleteClassRegistryRepository
  implements DeleteClassRegistryRepository
{
  async delete(id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException(Messages.INVALID_ID);
    }
    await ClassRegistryModel.destroy({
      where: { id },
    });
  }
}
