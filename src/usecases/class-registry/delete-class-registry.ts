import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import {
  DeleteClassRegistryRepository,
  FindClassRegistryRepository,
} from "@/domain/class-registry/repository";

export class DeleteClassRegistryUseCase {
  constructor(
    private readonly findRepo: FindClassRegistryRepository,
    private readonly deleteRepo: DeleteClassRegistryRepository
  ) {}

  async delete(id: string): Promise<void> {
    const registry = await this.findRepo.find(id);

    if (!registry) {
      throw new EntityNotFoundException(Messages.INVALID_CLASS_REGISTRY);
    }

    await this.deleteRepo.delete(registry.id);
  }
}
