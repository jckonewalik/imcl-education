import {
  CreateRepository,
  DeleteRepository,
  FindAllRepository,
  FindRepository,
  UpdateRepository,
} from "@/domain/@shared/repository/repository";
import { Student } from "../entity/student";

export interface FindStudentRepository extends FindRepository<Student> {}

export interface CreateStudentRepository extends CreateRepository<Student> {}
export interface UpdateStudentRepository extends UpdateRepository<Student> {}
export interface FindAllStudentsRepository extends FindAllRepository<Student> {}
export interface DeleteStudentRepository extends DeleteRepository {}

export interface FindInStudentsRepository {
  find(ids: string[]): Promise<Student[]>;
}
