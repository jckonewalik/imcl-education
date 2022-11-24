import { CreateRepository } from "@/domain/@shared/repository/repository";
import { ClassRegistry } from "../entity";

export interface CreateClassRegistryRepository
  extends CreateRepository<ClassRegistry> {}

export interface FindClassRegitryByDateRepository {
  find(studentClassId: string, date: Date): Promise<ClassRegistry | undefined>;
}
