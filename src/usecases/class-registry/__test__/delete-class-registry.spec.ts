import { EntityNotFoundException } from "@/domain/@shared/exceptions";
import Messages from "@/domain/@shared/util/messages";
import { ClassRegistry } from "@/domain/class-registry/entity";
import { DeleteClassRegistryRepository } from "@/domain/class-registry/repository";
import { v4 as uuid } from "uuid";
import { DeleteClassRegistryUseCase } from "../delete-class-registry";
import { makeClassRegistry } from "./util";

type SutsProps = {
  classRegistry?: ClassRegistry;
};
type Suts = {
  deleteRepo: DeleteClassRegistryRepository;
  sut: DeleteClassRegistryUseCase;
};

const makeSuts = ({ classRegistry }: SutsProps): Suts => {
  const findRepo = {
    async find(id: string): Promise<ClassRegistry | undefined> {
      return classRegistry;
    },
  };
  const deleteRepo = {
    delete: async (id: string) => {},
  };
  const sut = new DeleteClassRegistryUseCase(findRepo, deleteRepo);
  return { deleteRepo, sut };
};

describe("Delete Class Registry Use Case", () => {
  it("Delete a class registry by ID", async () => {
    const classRegistry = makeClassRegistry({});

    const { deleteRepo, sut } = makeSuts({
      classRegistry,
    });
    const spyDelete = jest.spyOn(deleteRepo, "delete");

    await sut.delete(classRegistry.id);

    expect(spyDelete).toHaveBeenCalledWith(classRegistry.id);
  });

  it("Fail deleting a invalid class registry", async () => {
    const { sut } = makeSuts({});

    const t = async () => {
      await sut.delete(uuid());
    };

    await expect(t).rejects.toThrow(EntityNotFoundException);
    await expect(t).rejects.toThrow(Messages.INVALID_CLASS_REGISTRY);
  });
});
