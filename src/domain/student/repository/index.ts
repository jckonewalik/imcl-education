import {
  CreateRepository,
  FindRepository,
  UpdateRepository,
} from "@/domain/@shared/repository/repository";
import { Student } from "../entity/student";

export interface FindStudentRepository extends FindRepository<Student> {}

export interface CreateStudentRepository extends CreateRepository<Student> {}
export interface UpdateStudentRepository extends UpdateRepository<Student> {}
