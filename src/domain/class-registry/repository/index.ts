import {
  CreateRepository,
  DeleteRepository,
  FindRepository,
  UpdateRepository,
} from "@/domain/@shared/repository/repository";
import { ClassRegistry } from "../entity";

export interface CreateClassRegistryRepository
  extends CreateRepository<ClassRegistry> {}

export interface FindClassRegistryRepository
  extends FindRepository<ClassRegistry> {}

export interface UpdateClassRegistryRepository
  extends UpdateRepository<ClassRegistry> {}

export interface DeleteClassRegistryRepository extends DeleteRepository {}

export interface FindClassRegitryByDateRepository {
  find(studentClassId: string, date: Date): Promise<ClassRegistry | undefined>;
}

export interface FindClassRegitryByStudentClassRepository {
  find(studentClassId: string): Promise<ClassRegistry[]>;
}
