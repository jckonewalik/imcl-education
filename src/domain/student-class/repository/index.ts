import {
  CreateRepository,
  DeleteRepository,
  FindAllRepository,
  FindRepository,
  UpdateRepository,
} from "@/domain/@shared/repository/repository";
import { StudentClass } from "@/domain/student-class/entity";

export interface CreateStudentClassRepository
  extends CreateRepository<StudentClass> {}

export interface FindStudentClassRepository
  extends FindRepository<StudentClass> {}

export interface UpdateStudentClassRepository
  extends UpdateRepository<StudentClass> {}

export interface DeleteStudentClassRepository extends DeleteRepository {}

export interface FindAllStudentClassesRepository
  extends FindAllRepository<StudentClass> {}
