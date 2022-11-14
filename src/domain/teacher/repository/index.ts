import {
  CreateRepository,
  DeleteRepository,
  FindAllRepository,
  FindRepository,
  UpdateRepository,
} from "@/domain/@shared/repository/repository";
import { Email } from "@/domain/@shared/value-objects";
import { Teacher } from "../entity";

export interface FindTeacherRepository extends FindRepository<Teacher> {}

export interface FindTeacherByEmailRepository {
  find(email: Email): Promise<Teacher | undefined>;
}

export interface FindInTeachersRepository {
  find(ids: string[]): Promise<Teacher[]>;
}

export interface CreateTeacherRepository extends CreateRepository<Teacher> {}

export interface UpdateTeacherRepository extends UpdateRepository<Teacher> {}

export interface FindAllTeachersRepository extends FindAllRepository<Teacher> {}

export interface DeleteTeacherRepository extends DeleteRepository {}
