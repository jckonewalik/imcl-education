import { CreateRepository } from "@/domain/@shared/repository/repository";
import { StudentClass } from "@/domain/student-class/entity";

export interface CreateStudentClassRepository
  extends CreateRepository<StudentClass> {}
