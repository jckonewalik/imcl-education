import {
  CreateRepository,
  FindRepository,
} from "@/domain/@shared/repository/repository";
import { Student } from "../entity/student";

export interface FindStudentRepository extends FindRepository<Student> {}

export interface CreateStudentRepository extends CreateRepository<Student> {}
